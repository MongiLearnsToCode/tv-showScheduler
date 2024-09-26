'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Plus } from "lucide-react"
import { getShows, addToSchedule } from "@/lib/airtable"

export default function Scheduler() {
  const [shows, setShows] = useState<any[]>([])
  const [selectedShow, setSelectedShow] = useState<any>(null)
  const [schedule, setSchedule] = useState<any[]>([])
  const [episodeTitle, setEpisodeTitle] = useState("")
  const [startTime, setStartTime] = useState("")

  useEffect(() => {
    const fetchShows = async () => {
      const fetchedShows = await getShows()
      setShows(fetchedShows)
    }
    fetchShows()
  }, [])

  const handleShowSelect = (showId: string) => {
    const show = shows.find(s => s.id === showId)
    setSelectedShow(show)
  }

  const handleScheduleShow = async () => {
    if (selectedShow && episodeTitle && startTime) {
      const newShow = {
        ...selectedShow,
        episodeTitle,
        startTime,
        duration: "01:00" // Assuming 1 hour duration for simplicity
      }
      await addToSchedule(newShow)
      setSchedule([...schedule, newShow])
      setSelectedShow(null)
      setEpisodeTitle("")
      setStartTime("")
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">TV Show Scheduler</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Show to Schedule</CardTitle>
          <CardDescription>Select a show and enter episode details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="show-select">Select Show</Label>
            <select
              id="show-select"
              className="w-full p-2 border rounded"
              onChange={(e) => handleShowSelect(e.target.value)}
              value={selectedShow?.id || ""}
            >
              <option value="">Select a show</option>
              {shows.map(show => (
                <option key={show.id} value={show.id}>{show.name}</option>
              ))}
            </select>
          </div>
          
          {selectedShow && (
            <>
              <div className="space-y-2">
                <Label htmlFor="episode-title">Episode Title</Label>
                <Input
                  id="episode-title"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleScheduleShow} disabled={!selectedShow || !episodeTitle || !startTime}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Show
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Upcoming shows</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Time</TableHead>
                <TableHead>Show Name</TableHead>
                <TableHead>Episode Title</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((show, index) => (
                <TableRow key={index}>
                  <TableCell>{show.startTime}</TableCell>
                  <TableCell>{show.name}</TableCell>
                  <TableCell>{show.episodeTitle}</TableCell>
                  <TableCell>{show.duration}</TableCell>
                </TableRow>
              ))}
              {schedule.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No shows scheduled</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}