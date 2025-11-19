'use client'

import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

const DAILY_QUOTES = [
  { text: '我就是自己一直在寻找的人。' },
  { text: '我的选择让我的人生独一无二。' },
  { text: '我选择相信而非怀疑。' },
  { text: '我可以选择害怕，但我选择了勇敢。' },
  { text: '我所经历的一切都有意义。' },
  { text: '重要的不是我来自何处，而是我去往何方。' },
  { text: '我已经很勇敢了，我做了我能做的事，我在我自己的意义上前进着。' },
  { text: '我是一个独特的、无与伦比的人。' },
  { text: '我拥抱自己的身体并对它说：“一直以来谢谢你”。' },
  { text: '我生命中的每一次选择，都是源于对自己的深深关怀与了解。' },
  { text: '我接纳、欣赏和爱护自己，不带任何条件。' },
  { text: '“迷路”本身就是走路的一部分。' },
  { text: '我会喜欢现在的我，接受过去的我，期待未来的我。' },
  { text: '不慌，我可以慢慢走。' },
  { text: '我的敏感就是我的天赋，我很有灵气也很敏锐，我很坚韧也很强大。' },
  { text: '我可以等泪干，等体力恢复，等悲伤退潮，等难关过去。' },
  { text: '我允许自己先放松一下，再出发向前。' },
  { text: '我学会了说不，因为我了解自己真正想要什么。' },
  { text: '我接受今天的自己，不完美也很可爱。' },
  { text: '我不美化那些没走过的路，而是坚定不移地走好我脚下这条。' },
  { text: '我不会失败，因为我要么收获成功，要么收获成长。' },
  { text: '每个早晨都是新的开始，美好的事情即将发生。' },
  { text: '我有千千万万种可能。' },
  { text: '我爱我自己，我相信我自己，我支持我自己。' },
  { text: '人生的容错率大到无法想象，我完全可以失败。' },
  { text: '我平静地去爱，毫不含糊地去信任，不带自嘲地去希望，勇敢地付诸行动。' },
  { text: '新的一天我带着希望和决心出发。' },
  { text: '我可以暂停一下，休息也是生活的一部分。' },
  { text: '我允许自己感到艰难，今天的我依然坚强。' },
  { text: '世界在我眼前自行展开，我能去任何地方，做任何事情，成为任何人。' },
  { text: '我的每一次尝试都是宝贵的。' },
  { text: '未竟之事如树叶落下，我让自己休息，等待新生。' },
]

const QUOTE_STORAGE_KEY = 'powerfulMe.dailyQuoteState'
const MAX_DAILY_VIEWS = 5

type QuoteDayState = {
  date: string
  viewCount: number
  firstQuoteIndex: number | null
  seenQuoteIndices: number[]
}

type QuoteRotationState = {
  order: number[]
  position: number
  day: QuoteDayState
}

const createShuffleOrder = () => {
  const indices = Array.from({ length: DAILY_QUOTES.length }, (_, index) => index)
  for (let i = indices.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[randomIndex]] = [indices[randomIndex], indices[i]]
  }
  return indices
}

const getTodayKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const createInitialState = (today: string): QuoteRotationState => ({
  order: createShuffleOrder(),
  position: 0,
  day: {
    date: today,
    viewCount: 0,
    firstQuoteIndex: null,
    seenQuoteIndices: [],
  },
})

const ensureValidOrder = (state: QuoteRotationState) => {
  const isArray = Array.isArray(state.order)
  const hasInvalidOrder =
    !isArray ||
    state.order.length !== DAILY_QUOTES.length ||
    state.order.some(
      (index) => typeof index !== 'number' || index < 0 || index >= DAILY_QUOTES.length
    ) ||
    new Set(state.order as number[]).size !== DAILY_QUOTES.length

  if (hasInvalidOrder) {
    state.order = createShuffleOrder()
    state.position = 0
  }

  if (state.position >= state.order.length) {
    state.order = createShuffleOrder()
    state.position = 0
  }
}

const normalizeState = (rawState: QuoteRotationState | null, today: string): QuoteRotationState => {
  if (!rawState) {
    return createInitialState(today)
  }

  const normalizedState: QuoteRotationState = {
    order: Array.isArray(rawState.order) ? [...rawState.order] : [],
    position: typeof rawState.position === 'number' ? Math.floor(rawState.position) : 0,
    day: {
      date: rawState.day?.date || today,
      viewCount: Math.max(
        Math.floor(typeof rawState.day?.viewCount === 'number' ? rawState.day.viewCount : 0),
        0
      ),
      firstQuoteIndex:
        typeof rawState.day?.firstQuoteIndex === 'number' ? rawState.day.firstQuoteIndex : null,
      seenQuoteIndices: Array.isArray(rawState.day?.seenQuoteIndices)
        ? rawState.day.seenQuoteIndices
            .map((index) => (typeof index === 'number' ? Math.floor(index) : null))
            .filter(
              (index): index is number =>
                index !== null && index >= 0 && index < DAILY_QUOTES.length
            )
            .slice(0, MAX_DAILY_VIEWS)
        : [],
    },
  }

  ensureValidOrder(normalizedState)

  if (
    normalizedState.position < 0 ||
    normalizedState.position >= normalizedState.order.length
  ) {
    normalizedState.position = 0
  }

  if (normalizedState.day.date !== today) {
    normalizedState.day = {
      date: today,
      viewCount: 0,
      firstQuoteIndex: null,
      seenQuoteIndices: [],
    }
  }

  if (
    normalizedState.day.seenQuoteIndices.length > 0 &&
    (normalizedState.day.firstQuoteIndex === null ||
      typeof normalizedState.day.firstQuoteIndex !== 'number')
  ) {
    normalizedState.day.firstQuoteIndex = normalizedState.day.seenQuoteIndices[0]
  }

  return normalizedState
}

const getNextQuoteIndex = (state: QuoteRotationState): number => {
  ensureValidOrder(state)

  const quoteIndex = state.order[state.position]
  state.position += 1

  if (state.position >= state.order.length) {
    state.order = createShuffleOrder()
    state.position = 0
  }

  return quoteIndex
}

const getQuoteForToday = (state: QuoteRotationState): { quoteIndex: number; state: QuoteRotationState } => {
  const updatedState: QuoteRotationState = {
    ...state,
    order: [...state.order],
    day: { ...state.day, seenQuoteIndices: [...state.day.seenQuoteIndices] },
  }

  let quoteIndex: number
  const seen = updatedState.day.seenQuoteIndices

  if (seen.length < MAX_DAILY_VIEWS) {
    quoteIndex = getNextQuoteIndex(updatedState)
    if (seen.length < MAX_DAILY_VIEWS) {
      seen.push(quoteIndex)
    }
  } else {
    const cycleIndex = updatedState.day.viewCount % MAX_DAILY_VIEWS
    quoteIndex = seen[cycleIndex]
  }

  updatedState.day.viewCount += 1

  if (
    updatedState.day.firstQuoteIndex === null ||
    typeof updatedState.day.firstQuoteIndex !== 'number'
  ) {
    updatedState.day.firstQuoteIndex = seen[0] ?? quoteIndex
  }

  return { quoteIndex, state: updatedState }
}

function formatQuoteWithLineBreaks(text: string) {
  return text.split('，').map((part, index) => (
    <div key={index}>
      {part}
      {index < text.split('，').length - 1 && <br />}
    </div>
  ))
}

export default function DailyQuote() {
  const [quote, setQuote] = useState<typeof DAILY_QUOTES[0] | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAuthor, setShowAuthor] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const today = getTodayKey()
    const storedState = window.localStorage.getItem(QUOTE_STORAGE_KEY)
    let parsedState: QuoteRotationState | null = null

    if (storedState) {
      try {
        parsedState = JSON.parse(storedState) as QuoteRotationState
      } catch (error) {
        parsedState = null
      }
    }

    const normalizedState = normalizeState(parsedState, today)
    const { quoteIndex, state: updatedState } = getQuoteForToday(normalizedState)

    try {
      window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(updatedState))
    } catch (error) {
      // Ignore storage write errors to keep the experience functional
    }
    setQuote(DAILY_QUOTES[quoteIndex])
  }, [])

  const handleReveal = () => {
    setIsFlipped(true)
    setTimeout(() => setShowAuthor(true), 200)
  }

  const handleReset = () => {
    setIsFlipped(false)
    setShowAuthor(false)
  }

  if (!quote) return null

  return (
    <div className="w-full max-w-md md:max-w-2xl px-6 md:px-8 py-12">
      {/* 标题 */}
      <div className="text-center mb-16 md:mb-20 animate-fade-in">
        <h1 className="text-sm md:text-base tracking-widest text-muted-foreground uppercase mb-4">
          能量补给站
        </h1>
        <div className="h-0.5 w-12 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </div>

      {/* 日期 */}
      <div className="text-center mb-8 md:mb-12">
        <p className="text-xs md:text-sm text-muted-foreground leading-7 mx-0 mt-[-60px]">
          {new Date().toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      {/* 话语卡片 */}
      <div className="mb-16 md:mb-20 animate-slide-up">
        <div
          className={`relative min-h-96 md:min-h-[28rem] rounded-lg bg-card border border-border backdrop-blur-sm p-8 md:p-16 flex flex-col items-center justify-center cursor-pointer group transition-all duration-700 ${
            isFlipped ? 'opacity-80' : 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
          }`}
          onClick={isFlipped ? handleReset : undefined}
        >
          {/* 装饰线 - 上 */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          {/* 装饰线 - 下 */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          {/* 话语内容 */}
          <div className="text-center">
            <div className="text-3xl md:text-4xl leading-relaxed tracking-widest font-light text-foreground"
              style={{ fontFamily: 'var(--font-serif-cn), serif' }}>
              {formatQuoteWithLineBreaks(quote.text)}
            </div>
          </div>

          {/* 作者信息 */}
          <div
            className={`h-12 flex items-center justify-center transition-all duration-500 ${
              showAuthor ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-sm md:text-base text-primary font-medium">
              — {quote.author}
            </p>
          </div>

          {/* 鼠标悬停提示 - 未翻转时 */}
          {!isFlipped && (
            <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center">
              
            </div>
          )}

          {/* 重置提示 - 翻转后 */}
          {isFlipped && (
            <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center">
              <p className="text-xs text-muted-foreground">
                点击重置
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 md:gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        

        
      </div>

      {/* 页脚信息 */}
      <div className="text-center text-xs md:text-sm text-muted-foreground/60 animate-fade-in" style={{ animationDelay: '0.3s', letterSpacing: '0.5em' }}>
        <p>每一天都值得被肯定</p>
      </div>
    </div>
  )
}
