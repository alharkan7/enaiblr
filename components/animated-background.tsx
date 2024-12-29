"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,100,0.2),rgba(255,200,200,0.1),rgba(169,255,255,0.2))]" />
      <div 
        className="absolute inset-0 animate-gradient-slow"
        style={{
          background: `
            linear-gradient(45deg, 
              rgba(255,255,190,0.3) 0%,
              rgba(255,200,200,0.3) 33%,
              rgba(200,255,255,0.3) 66%,
              rgba(255,255,190,0.3) 100%
            )
          `,
          backgroundSize: '400% 400%',
        }}
      />
    </div>
  )
}

