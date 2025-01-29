"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, DollarSign, PieChart, Plus, Receipt, Send, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

interface GroupMember {
  id: number
  name: string
  paid: number
  share: number
}

// Helper function to calculate optimal settlements
function calculateSettlements(members: GroupMember[]) {
  // Convert amounts to numbers and calculate net amounts
  const netAmounts = members.map(m => ({
    id: m.id,
    name: m.name,
    amount: m.paid - m.share
  })).sort((a, b) => a.amount - b.amount)

  const settlements: { from: string; to: string; amount: number }[] = []
  let i = 0
  let j = netAmounts.length - 1

  while (i < j) {
    const debt = Math.min(-netAmounts[i].amount, netAmounts[j].amount)
    if (debt > 0) {
      settlements.push({
        from: netAmounts[i].name,
        to: netAmounts[j].name,
        amount: Math.round(debt * 100) / 100
      })
    }
    
    netAmounts[i].amount += debt
    netAmounts[j].amount -= debt

    if (netAmounts[i].amount === 0) i++
    if (netAmounts[j].amount === 0) j--
  }

  return settlements
}

export default function DashboardPage() {
  const [inviteEmails, setInviteEmails] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<number[]>([])
  
  const mockExpenses = [
    { id: 1, description: "Dinner at Italian Restaurant", amount: 120.50, split: 4, date: "2024-03-20", paidBy: "Alice" },
    { id: 2, description: "Hotel Booking", amount: 450.00, split: 2, date: "2024-03-19", paidBy: "Bob" },
    { id: 3, description: "Taxi Ride", amount: 35.20, split: 3, date: "2024-03-18", paidBy: "Charlie" },
  ]

  const mockGroupMembers = [
    { id: 1, name: "Alice", paid: 1050, share: 1000 },
    { id: 2, name: "Bob", paid: 970, share: 1000 },
    { id: 3, name: "Charlie", paid: 980, share: 1000 },
    { id: 4, name: "David", paid: 1000, share: 1000 },
  ]

  const mockGroups = [
    { 
      id: 1, 
      name: "Summer Trip 2024", 
      members: mockGroupMembers,
      totalExpenses: 4000,
      expenses: mockExpenses
    },
    { 
      id: 2, 
      name: "Roommates", 
      members: mockGroupMembers.slice(0, 3),
      totalExpenses: 325.20,
      expenses: []
    },
  ]

  const settlements = calculateSettlements(mockGroupMembers)

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    toast.success("Group created successfully!")
    form.reset()
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    toast.success("Expense added successfully!")
    form.reset()
  }

  const handleInviteMembers = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Invitations sent successfully!")
    setInviteEmails("")
  }

  const toggleExpenses = (groupId: number) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden w-64 border-r bg-card p-6 lg:block">
        <div className="flex items-center gap-2 mb-8">
          <Receipt className="h-6 w-6" />
          <span className="font-semibold">SplitWise</span>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <PieChart className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Receipt className="mr-2 h-4 w-4" />
            Expenses
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your spending overview.</p>
          </div>
          <div className="flex gap-3">
            {/* Create Group Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>
                    Create a new group to start tracking shared expenses.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input id="groupName" name="groupName" placeholder="e.g., Summer Trip 2024" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" placeholder="Brief description of the group" />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Group</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Invite Members Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Members</DialogTitle>
                  <DialogDescription>
                    Invite people to join your group and split expenses.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteMembers} className="space-y-4">
                  <div>
                    <Label htmlFor="inviteGroup">Select Group</Label>
                    <Select name="group" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockGroups.map(group => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emails">Email Addresses</Label>
                    <Input
                      id="emails"
                      placeholder="Enter email addresses (comma-separated)"
                      value={inviteEmails}
                      onChange={(e) => setInviteEmails(e.target.value)}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Send Invites</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,250.45</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">2 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,546.80</div>
              <p className="text-xs text-muted-foreground">12 expenses this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="groups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="groups">Active Groups</TabsTrigger>
            <TabsTrigger value="settled">Settled Groups</TabsTrigger>
            <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockGroups.map((group) => (
                <Card key={group.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 flex flex-col gap-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {group.members.length} members • ${group.totalExpenses.toFixed(2)} total
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toggleExpenses(group.id)}>
                          {expandedGroups.includes(group.id) ? 'Hide' : 'Show'} Expenses
                        </Button>
                      </div>
                      
                      <div className="flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Expense
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Expense to {group.name}</DialogTitle>
                              <DialogDescription>
                                Add a new expense to split with your group.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddExpense} className="space-y-4">
                              <div>
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" name="description" placeholder="What's this expense for?" required />
                              </div>
                              <div>
                                <Label htmlFor="amount">Amount</Label>
                                <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required />
                              </div>
                              <div>
                                <Label htmlFor="paidBy">Paid By</Label>
                                <Select name="paidBy" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Who paid?" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {group.members.map(member => (
                                      <SelectItem key={member.id} value={member.id.toString()}>
                                        {member.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="split">Split Type</Label>
                                <Select name="splitType" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="How to split?" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="equal">Split Equally</SelectItem>
                                    <SelectItem value="percentage">By Percentage</SelectItem>
                                    <SelectItem value="custom">Custom Amount</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Add Expense</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        {group.members.map((member) => {
                          const balance = member.paid - member.share
                          const isPositive = balance > 0
                          return (
                            <div key={member.id} className="flex items-center justify-between py-2 border-b last:border-0">
                              <span className="font-medium">{member.name}</span>
                              <span className={`font-semibold ${isPositive ? 'text-green-600' : balance < 0 ? 'text-red-600' : ''}`}>
                                {isPositive ? '+' : ''}{balance.toFixed(2)}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {expandedGroups.includes(group.id) && (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Recent Expenses</h4>
                          <div className="space-y-2">
                            {group.expenses.map((expense) => (
                              <div key={expense.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div>
                                  <p className="font-medium">{expense.description}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Paid by {expense.paidBy} • {expense.date}
                                  </p>
                                </div>
                                <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settled">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add settled groups here with similar card structure */}
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            {mockExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-semibold">{expense.description}</h3>
                    <p className="text-sm text-muted-foreground">Split between {expense.split} people • {expense.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Your share: ${(expense.amount / expense.split).toFixed(2)}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}