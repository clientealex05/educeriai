"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, LogOut, Users, BookOpen, TrendingUp, AlertCircle, CheckCircle, Award } from "lucide-react"
import {
  mockStudents,
  mockSubjects,
  mockGrades,
  getStudentGrades,
  calculateAverage,
  getStudentBehavior,
} from "@/lib/mock-data"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0].id)

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  const student = mockStudents.find((s) => s.id === selectedStudent)!
  const studentGrades = getStudentGrades(selectedStudent)
  const studentBehavior = getStudentBehavior(selectedStudent)
  const average = calculateAverage(studentGrades)

  // Chart data
  const chartData = studentGrades.map((grade) => {
    const subject = mockSubjects.find((s) => s.id === grade.subjectId)
    return {
      subject: subject?.name || "",
      score: Math.round((grade.score / grade.maxScore) * 100),
    }
  })

  const behaviorData = [
    {
      category: "Participación",
      rating:
        studentBehavior.filter((b) => b.category === "participation").reduce((acc, b) => acc + b.rating, 0) /
          studentBehavior.filter((b) => b.category === "participation").length || 0,
    },
    {
      category: "Comportamiento",
      rating:
        studentBehavior.filter((b) => b.category === "behavior").reduce((acc, b) => acc + b.rating, 0) /
          studentBehavior.filter((b) => b.category === "behavior").length || 0,
    },
    {
      category: "Tareas",
      rating:
        studentBehavior.filter((b) => b.category === "homework").reduce((acc, b) => acc + b.rating, 0) /
          studentBehavior.filter((b) => b.category === "homework").length || 0,
    },
    {
      category: "Asistencia",
      rating:
        studentBehavior.filter((b) => b.category === "attendance").reduce((acc, b) => acc + b.rating, 0) /
          studentBehavior.filter((b) => b.category === "attendance").length || 0,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">EduCeriAI</h1>
              <p className="text-xs text-muted-foreground">Panel de Docente</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">Docente</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Estudiantes</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockStudents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Grado 10</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Materias</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockSubjects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Activas este período</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Promedio General</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">84%</div>
              <p className="text-xs text-green-500 mt-1">+3% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alertas IA</CardTitle>
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2</div>
              <p className="text-xs text-muted-foreground mt-1">Estudiantes necesitan apoyo</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="grades">Calificaciones</TabsTrigger>
            <TabsTrigger value="reports">Reportes IA</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Estudiantes</CardTitle>
                <CardDescription>Selecciona un estudiante para ver su perfil completo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((s) => {
                    const grades = getStudentGrades(s.id)
                    const avg = calculateAverage(grades)
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedStudent === s.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedStudent(s.id)}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={s.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {s.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{s.name}</p>
                            <p className="text-sm text-muted-foreground">Grado {s.grade}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">{avg}%</p>
                            <p className="text-xs text-muted-foreground">Promedio</p>
                          </div>
                          <Badge variant={avg >= 80 ? "default" : avg >= 70 ? "secondary" : "destructive"}>
                            {avg >= 80 ? "Excelente" : avg >= 70 ? "Bueno" : "Necesita apoyo"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Student Detail */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento Académico - {student.name}</CardTitle>
                  <CardDescription>Calificaciones por materia</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      score: {
                        label: "Calificación",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comportamiento y Hábitos</CardTitle>
                  <CardDescription>Evaluación integral del estudiante</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      rating: {
                        label: "Calificación",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={behaviorData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis
                          dataKey="category"
                          type="category"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          width={100}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="rating" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresar Calificaciones</CardTitle>
                <CardDescription>Registra las notas de tus estudiantes</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student">Estudiante</Label>
                      <Select>
                        <SelectTrigger id="student">
                          <SelectValue placeholder="Seleccionar estudiante" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockStudents.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Materia</Label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Seleccionar materia" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSubjects.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="score">Calificación</Label>
                      <Input id="score" type="number" placeholder="85" min="0" max="100" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Guardar Calificación
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calificaciones Recientes</CardTitle>
                <CardDescription>Últimas notas registradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockGrades.slice(0, 5).map((grade) => {
                    const student = mockStudents.find((s) => s.id === grade.studentId)
                    const subject = mockSubjects.find((s) => s.id === grade.subjectId)
                    const percentage = Math.round((grade.score / grade.maxScore) * 100)

                    return (
                      <div
                        key={grade.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={student?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {student?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{student?.name}</p>
                            <p className="text-sm text-muted-foreground">{subject?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">{percentage}%</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(grade.date).toLocaleDateString("es")}
                            </p>
                          </div>
                          <Badge
                            variant={percentage >= 80 ? "default" : percentage >= 70 ? "secondary" : "destructive"}
                          >
                            {percentage >= 80 ? "A" : percentage >= 70 ? "B" : "C"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Análisis Inteligente por IA
                </CardTitle>
                <CardDescription>Recomendaciones personalizadas para cada estudiante</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((student) => {
                    const grades = getStudentGrades(student.id)
                    const avg = calculateAverage(grades)
                    const needsSupport = avg < 80

                    return (
                      <div key={student.id} className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{student.name}</p>
                              <p className="text-sm text-muted-foreground">Promedio: {avg}%</p>
                            </div>
                          </div>
                          {needsSupport && (
                            <Badge variant="destructive">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Necesita apoyo
                            </Badge>
                          )}
                        </div>

                        <div className="pl-13 space-y-2">
                          <div className="flex items-start gap-2">
                            <Brain className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Estilo de aprendizaje detectado:</p>
                              <p className="text-sm text-muted-foreground">
                                Visual - Aprende mejor con diagramas y mapas conceptuales
                              </p>
                            </div>
                          </div>

                          {needsSupport && (
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Áreas de refuerzo:</p>
                                <p className="text-sm text-muted-foreground">
                                  {grades
                                    .filter((g) => (g.score / g.maxScore) * 100 < 80)
                                    .map((g) => {
                                      const subject = mockSubjects.find((s) => s.id === g.subjectId)
                                      return subject?.name
                                    })
                                    .join(", ")}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Recomendación:</p>
                              <p className="text-sm text-muted-foreground">
                                {needsSupport
                                  ? "Asignar tutorías personalizadas y recursos visuales adicionales"
                                  : "Continuar con el ritmo actual y considerar material avanzado"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
