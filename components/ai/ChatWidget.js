'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, X, Minimize2, Maximize2, Send, ThumbsUp, ThumbsDown, Bot, User, Loader2 } from 'lucide-react'

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [userType, setUserType] = useState('rider')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const shellRef = useRef(null)

    /* Three things park on the bottom edge of a phone: this widget, the cookie
     * banner, and (on the /preview pages) the app-download CTA. The banner and
     * the CTA both outranked this corner, so the assistant button could not be
     * tapped at all on mobile, and once open the CTA covered the input row.
     *
     * Lift clear of the banner — its height depends on how the text wraps, so
     * it has to be measured — and outrank both: the assistant is something the
     * visitor deliberately opened, so it wins the corner while it is up. */
    useEffect(() => {
        const el = shellRef.current
        if (!el) return
        let observed = null
        const ro = new ResizeObserver(() => measure())
        const measure = () => {
            const banner = document.querySelector('.CookieConsent')
            el.style.setProperty('--chat-lift', banner ? `${banner.offsetHeight + 10}px` : '0px')
            if (banner !== observed) {
                if (observed) ro.unobserve(observed)
                if (banner) ro.observe(banner)
                observed = banner
            }
        }
        // the banner mounts and unmounts on its own schedule
        const mo = new MutationObserver(measure)
        mo.observe(document.body, { childList: true })
        window.addEventListener('resize', measure)
        measure()
        return () => {
            ro.disconnect()
            mo.disconnect()
            window.removeEventListener('resize', measure)
        }
    }, [isOpen])

    /* data-chat is the stable hook the /preview stylesheet restyles through.
     * It used to key off the Tailwind position classes, which meant the widget
     * could not be moved without silently losing its styling. */
    const shell = {
        ref: shellRef,
        'data-chat': isOpen ? 'open' : 'closed',
        className: 'fixed right-4 sm:right-6 z-[1000]',
        style: { bottom: 'calc(1.5rem + var(--chat-lift, 0px))' },
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/agent/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: inputValue,
                    user_type: userType
                })
            })

            const data = await response.json()

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: data.answer,
                sources: Array.isArray(data.sources) ? data.sources.filter(x => x && x.url) : [],
                source: data.source,
                model_used: data.model_used,
                conversation_id: data.conversation_id,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again or contact support@spinr.ca',
                source: 'error',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleFeedback = async (conversationId, isHelpful) => {
        try {
            await fetch('/api/agent/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversation_id: conversationId,
                    is_helpful: isHelpful
                })
            })
        } catch (error) {
            console.error('Error sending feedback:', error)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const getSourceLabel = (source) => {
        switch (source) {
            case 'ai_agent':
                return 'AI Agent'
            case 'fallback_search':
                return 'Keyword Search'
            case 'cache':
                return 'Cached'
            default:
                return source
        }
    }

    if (!isOpen) {
        return (
            <div {...shell}>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
                    size="icon"
                    aria-label="Open the Spinr AI assistant"
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>
            </div>
        )
    }

    return (
        <div {...shell}>
            {/* Never taller than the space actually left over the banner, and
                never wider than the screen — a fixed 500px box overflowed both
                on a short phone. */}
            <Card
                className={`flex flex-col w-[min(20rem,calc(100vw-2rem))] md:w-96 shadow-xl transition-all duration-300 ${isMinimized ? 'h-14' : ''}`}
                style={isMinimized ? undefined : { height: 'min(500px, calc(100dvh - var(--chat-lift, 0px) - 7rem))' }}
            >
                <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <CardTitle className="text-sm font-medium">Spinr AI Assistant</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsMinimized(!isMinimized)}
                            aria-label={isMinimized ? 'Expand the assistant' : 'Minimise the assistant'}
                        >
                            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close the assistant"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                        {/* User Type Selector */}
                        <div className="p-3 border-b bg-gray-50">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">I am a:</span>
                                <Select value={userType} onValueChange={setUserType}>
                                    <SelectTrigger className="w-24 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rider">Rider</SelectItem>
                                        <SelectItem value="driver">Driver</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                                    <p className="font-medium">Hi! I am Spinr AI Assistant</p>
                                    <p className="text-sm mt-2">Ask me anything about riding or driving with Spinr!</p>
                                </div>
                            )}

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {message.type === 'bot' && (
                                                <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                                            )}
                                            {message.type === 'user' && (
                                                <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                {/* the pages the answer came from, so the reader can go
                                                    read the whole thing rather than just be told it exists */}
                                                {message.sources?.length > 0 && (
                                                    <ul className="mt-2 space-y-1">
                                                        {message.sources.map((s) => (
                                                            <li key={s.url}>
                                                                <a
                                                                    href={s.url}
                                                                    className="text-xs font-semibold underline underline-offset-2"
                                                                >
                                                                    {s.title}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {message.source && message.source !== 'error' && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className="text-xs opacity-70">
                                                            Source: {getSourceLabel(message.source)}
                                                        </span>
                                                        {message.conversation_id && (
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    onClick={() => handleFeedback(message.conversation_id, true)}
                                                                    aria-label="This answer was helpful"
                                                                >
                                                                    <ThumbsUp className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    onClick={() => handleFeedback(message.conversation_id, false)}
                                                                    aria-label="This answer was not helpful"
                                                                >
                                                                    <ThumbsDown className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                            <Bot className="h-4 w-4 text-primary" />
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-sm text-muted-foreground">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t">
                            <div className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask a question..."
                                    disabled={isLoading}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    size="icon"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 text-center leading-tight">
                                Spinr AI can make mistakes. Check important info. <br />
                                Powered by Spinr AI
                            </p>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    )
}