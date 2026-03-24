'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Clock, Zap, Search } from 'lucide-react'

export default function AgentConversationsPage() {
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        user_type: 'all',
        source: 'all',
        needs_review: 'all',
        date_from: '',
        date_to: ''
    })
    const [stats, setStats] = useState({
        total: 0,
        avgResponseTime: 0,
        helpfulnessRate: 0,
        aiAgentCount: 0,
        fallbackCount: 0
    })
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedConversation, setSelectedConversation] = useState(null)

    useEffect(() => {
        fetchConversations()
        fetchStats()
    }, [filters, page])

    const fetchConversations = async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('agent_conversations')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range((page - 1) * 20, page * 20 - 1)

            if (filters.user_type !== 'all') {
                query = query.eq('user_type', filters.user_type)
            }
            if (filters.source !== 'all') {
                query = query.eq('source', filters.source)
            }
            if (filters.needs_review !== 'all') {
                query = query.eq('needs_review', filters.needs_review === 'true')
            }
            if (filters.date_from) {
                query = query.gte('created_at', filters.date_from)
            }
            if (filters.date_to) {
                query = query.lte('created_at', filters.date_to)
            }

            const { data, error, count } = await query

            if (error) throw error

            setConversations(data || [])
            setTotalPages(Math.ceil((count || 0) / 20))
        } catch (error) {
            console.error('Error fetching conversations:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .from('agent_conversations')
                .select('source, response_time_ms, is_helpful')

            if (error) throw error

            const total = data.length
            const aiAgentCount = data.filter(c => c.source === 'ai_agent').length
            const fallbackCount = data.filter(c => c.source === 'fallback_search').length
            const avgResponseTime = data.reduce((sum, c) => sum + (c.response_time_ms || 0), 0) / total
            const helpfulCount = data.filter(c => c.is_helpful === true).length
            const helpfulnessRate = total > 0 ? (helpfulCount / total) * 100 : 0

            setStats({
                total,
                avgResponseTime: Math.round(avgResponseTime),
                helpfulnessRate: helpfulnessRate.toFixed(1),
                aiAgentCount,
                fallbackCount
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const markForReview = async (id) => {
        try {
            const { error } = await supabase
                .from('agent_conversations')
                .update({ needs_review: true })
                .eq('id', id)

            if (error) throw error
            fetchConversations()
        } catch (error) {
            console.error('Error marking for review:', error)
        }
    }

    const markAsReviewed = async (id) => {
        try {
            const { error } = await supabase
                .from('agent_conversations')
                .update({
                    needs_review: false,
                    reviewed_by: 'admin',
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', id)

            if (error) throw error
            fetchConversations()
        } catch (error) {
            console.error('Error marking as reviewed:', error)
        }
    }

    const getSourceBadge = (source) => {
        switch (source) {
            case 'ai_agent':
                return <Badge className="bg-purple-100 text-purple-700"><Zap className="w-3 h-3 mr-1" />AI Agent</Badge>
            case 'fallback_search':
                return <Badge className="bg-blue-100 text-blue-700"><Search className="w-3 h-3 mr-1" />Keyword Search</Badge>
            default:
                return <Badge variant="outline">{source}</Badge>
        }
    }

    const getHelpfulnessBadge = (isHelpful) => {
        if (isHelpful === true) {
            return <Badge className="bg-green-100 text-green-700"><ThumbsUp className="w-3 h-3 mr-1" />Helpful</Badge>
        } else if (isHelpful === false) {
            return <Badge className="bg-red-100 text-red-700"><ThumbsDown className="w-3 h-3 mr-1" />Not Helpful</Badge>
        }
        return <Badge variant="outline">No Feedback</Badge>
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">AI Agent Conversations</h1>
                <p className="text-muted-foreground">Review and manage AI agent conversations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Conversations</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">AI Agent</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.aiAgentCount}</p>
                            </div>
                            <Zap className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Fallback Search</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.fallbackCount}</p>
                            </div>
                            <Search className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                                <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Helpfulness Rate</p>
                                <p className="text-2xl font-bold text-green-600">{stats.helpfulnessRate}%</p>
                            </div>
                            <ThumbsUp className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">User Type</label>
                            <Select value={filters.user_type} onValueChange={(v) => setFilters({ ...filters, user_type: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="rider">Rider</SelectItem>
                                    <SelectItem value="driver">Driver</SelectItem>
                                    <SelectItem value="anonymous">Anonymous</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Source</label>
                            <Select value={filters.source} onValueChange={(v) => setFilters({ ...filters, source: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="ai_agent">AI Agent</SelectItem>
                                    <SelectItem value="fallback_search">Fallback Search</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Needs Review</label>
                            <Select value={filters.needs_review} onValueChange={(v) => setFilters({ ...filters, needs_review: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Date From</label>
                            <Input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Date To</label>
                            <Input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Conversations List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No conversations found</p>
                        </CardContent>
                    </Card>
                ) : (
                    conversations.map((conv) => (
                        <Card key={conv.id} className={conv.needs_review ? 'border-orange-300 bg-orange-50' : ''}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {getSourceBadge(conv.source)}
                                        {getHelpfulnessBadge(conv.is_helpful)}
                                        {conv.needs_review && (
                                            <Badge className="bg-orange-100 text-orange-700">
                                                <AlertTriangle className="w-3 h-3 mr-1" />Needs Review
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>{conv.user_type}</span>
                                        <span>•</span>
                                        <span>{new Date(conv.created_at).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="font-medium text-sm text-muted-foreground mb-1">Question:</p>
                                    <p className="text-sm">{conv.question}</p>
                                </div>

                                <div className="mb-3">
                                    <p className="font-medium text-sm text-muted-foreground mb-1">Answer:</p>
                                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{conv.answer}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Model: {conv.model_used || 'N/A'}</span>
                                        <span>Tokens: {conv.tokens_used || 0}</span>
                                        <span>Response: {conv.response_time_ms || 0}ms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {conv.needs_review ? (
                                            <Button size="sm" variant="outline" onClick={() => markAsReviewed(conv.id)}>
                                                <CheckCircle className="w-4 h-4 mr-1" />Mark Reviewed
                                            </Button>
                                        ) : (
                                            <Button size="sm" variant="outline" onClick={() => markForReview(conv.id)}>
                                                <AlertTriangle className="w-4 h-4 mr-1" />Flag for Review
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}