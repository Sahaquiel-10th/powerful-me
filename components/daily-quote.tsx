'use client'

import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

const DAILY_QUOTES = [
  {
    text: '每一天都是一个新的开始，努力让今天比昨天更精彩。',
  },
  {
    text: '不是每个人都能成为伟大的人，但每个人都可以用伟大的爱去做平凡的事。',
  },
  {
    text: '生活就像骑自行车，要保持平衡就得不断前进。',
  },
  {
    text: '最困难的时刻往往是最接近成功的时刻。',
  },
  {
    text: '你的努力不会白费，每一步都在靠近梦想。',
  },
  {
    text: '相信自己，你已经走过了最难的部分。',
  },
  {
    text: '失败不是终点，而是重新开始的信号。',
  },
  {
    text: '用心去感受生活的美好，用行动去改变世界。',
  },
  {
    text: '时间会证明你的坚持有多珍贵。',
  },
  {
    text: '做最好的自己，比证明自己比别人更好要有意义。',
  }
]

function getQuoteOfDay() {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length]
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
    setQuote(getQuoteOfDay())
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
