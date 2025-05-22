import type * as React from "react"
import { cn } from "../../lib/utils"

interface EditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Editor({ className, ...props }: EditorProps) {
  return (
    <div className="border rounded-md">
      <div className="border-b bg-muted/50 p-2">
        <div className="flex flex-wrap gap-1">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-8 h-8 rounded bg-muted" />
          ))}
        </div>
      </div>
      <textarea
        className={cn(
          "min-h-[200px] w-full resize-none border-0 bg-transparent p-4 focus-visible:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  )
}

