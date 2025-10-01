"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, LogOut, BookOpen, TrendingUp, Target, Lightbulb, Award, CheckCircle } from "lucide-react"
import {
  mockStudents,
  mockSubjects,
  getStudentGrades,
  calculateAverage,
  getStudentBehavior,
  getStudentRecommendations,
  getSubjectById,
} from "@/lib/mock-data"
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  // For demo, use first student
  const student = mockStudents[0]
  const grades = getStudentGrades(student.id)
  const behavior = getStudentBehavior(student.id)
  const recommendations = getStudentRecommendations(student.id)
  const average = calculateAverage(grades)

  // Chart data for radial progress
  const progressData = [
    {
      name: "Progreso",
      value: average,
      fill: "hsl(var(--chart-1))",
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
              <p className="text-xs text-muted-foreground">Mi Panel de Aprendizaje</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={student.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{student.name}</p>
                <p className="text-xs text-muted-foreground">Grado {student.grade}</p>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">¡Hola, {student.name.split(" ")[0]}! 👋</h2>
          <p className="text-muted-foreground">Aquí está tu progreso académico y recomendaciones personalizadas</p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Promedio General</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{average}%</div>
              <Progress value={average} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Materias</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{grades.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Calificaciones registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Comportamiento</CardTitle>
              <Award className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4.5/5</div>
              <p className="text-xs text-green-500 mt-1">Excelente desempeño</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recomendaciones IA</CardTitle>
              <Brain className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{recommendations.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Nuevas sugerencias</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList>
            <TabsTrigger value="progress">Mi Progreso</TabsTrigger>
            <TabsTrigger value="learning">Ruta de Aprendizaje</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones IA</TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Overall Progress */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Progreso General</CardTitle>
                  <CardDescription>Tu rendimiento actual</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Progreso",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[200px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        data={progressData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey="value" cornerRadius={10} fill="hsl(var(--chart-1))" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="text-center mt-4">
                    <p className="text-4xl font-bold text-foreground">{average}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Promedio General</p>
                    <Badge className="mt-3" variant={average >= 80 ? "default" : "secondary"}>
                      {average >= 80 ? "Excelente" : "Bueno"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Grades by Subject */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Calificaciones por Materia</CardTitle>
                  <CardDescription>Tus notas en cada asignatura</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {grades.map((grade) => {
                      const subject = getSubjectById(grade.subjectId)
                      const percentage = Math.round((grade.score / grade.maxScore) * 100)

                      return (
                        <div key={grade.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{subject?.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {grade.score}/{grade.maxScore}
                              </span>
                              <Badge
                                variant={percentage >= 80 ? "default" : percentage >= 70 ? "secondary" : "destructive"}
                              >
                                {percentage}%
                              </Badge>
                            </div>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Behavior Section */}
            <Card>
              <CardHeader>
                <CardTitle>Comportamiento y Hábitos</CardTitle>
                <CardDescription>Evaluación de tu desempeño integral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { category: "Participación", icon: Target, rating: 4, color: "text-chart-1" },
                    { category: "Comportamiento", icon: Award, rating: 4, color: "text-chart-2" },
                    { category: "Tareas", icon: CheckCircle, rating: 5, color: "text-chart-3" },
                    { category: "Asistencia", icon: TrendingUp, rating: 5, color: "text-chart-4" },
                  ].map((item) => (
                    <div key={item.category} className="p-4 rounded-lg border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-sm font-medium text-foreground">{item.rating}/5</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.category}</p>
                        <Progress value={item.rating * 20} className="mt-2 h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Path Tab */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Tu Ruta de Aprendizaje Personalizada
                </CardTitle>
                <CardDescription>Creada especialmente para tu estilo de aprendizaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Learning Style */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Estilo de Aprendizaje: Visual</h3>
                        <p className="text-sm text-muted-foreground">
                          La IA ha detectado que aprendes mejor con contenido visual como diagramas, mapas conceptuales
                          y videos explicativos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Learning Path Steps */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Pasos Recomendados</h3>

                    {mockSubjects.map((subject, index) => {
                      const grade = grades.find((g) => g.subjectId === subject.id)
                      const percentage = grade ? Math.round((grade.score / grade.maxScore) * 100) : 0
                      const needsWork = percentage < 80

                      return (
                        <div key={subject.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                needsWork ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                              }`}
                            >
                              {index + 1}
                            </div>
                            {index < mockSubjects.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                          </div>

                          <div className="flex-1 pb-6">
                            <div className="p-4 rounded-lg border border-border space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-foreground">{subject.name}</h4>
                                {needsWork && <Badge variant="destructive">Refuerzo necesario</Badge>}
                              </div>

                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Temas del pensum:</p>
                                <ul className="space-y-1">
                                  {subject.curriculum.slice(0, 2).map((topic, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                      <CheckCircle className="w-3 h-3 text-primary" />
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {needsWork && (
                                <div className="pt-2 border-t border-border">
                                  <p className="text-sm font-medium text-foreground mb-2">Recursos recomendados:</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">Videos explicativos</Badge>
                                    <Badge variant="outline">Mapas conceptuales</Badge>
                                    <Badge variant="outline">Ejercicios prácticos</Badge>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Recomendaciones de la IA
                </CardTitle>
                <CardDescription>Sugerencias personalizadas para mejorar tu aprendizaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec) => {
                    const subject = rec.subjectId ? getSubjectById(rec.subjectId) : null

                    return (
                      <div key={rec.id} className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                rec.priority === "high"
                                  ? "bg-destructive/20"
                                  : rec.priority === "medium"
                                    ? "bg-primary/20"
                                    : "bg-muted"
                              }`}
                            >
                              {rec.type === "reinforcement" && <Target className="w-5 h-5" />}
                              {rec.type === "learning-path" && <Brain className="w-5 h-5" />}
                              {rec.type === "resource" && <BookOpen className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">{rec.title}</h4>
                                {subject && (
                                  <Badge variant="outline" className="text-xs">
                                    {subject.name}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{rec.description}</p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              rec.priority === "high"
                                ? "destructive"
                                : rec.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {rec.priority === "high" ? "Alta" : rec.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                        </div>

                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          Ver recursos
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <Card>
              <CardHeader>
                <CardTitle>Consejos para Mejorar</CardTitle>
                <CardDescription>Basados en tu perfil de aprendizaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Usa mapas mentales",
                      description: "Como aprendiz visual, los mapas mentales te ayudarán a conectar conceptos",
                      icon: Brain,
                    },
                    {
                      title: "Videos educativos",
                      description: "Complementa tu estudio con videos de Khan Academy y Crash Course",
                      icon: BookOpen,
                    },
                    {
                      title: "Práctica constante",
                      description: "Dedica 30 minutos diarios a ejercicios de las áreas que necesitas reforzar",
                      icon: Target,
                    },
                    {
                      title: "Participa en clase",
                      description: "Tu participación es excelente, ¡sigue así! Ayuda a consolidar el aprendizaje",
                      icon: Award,
                    },
                  ].map((tip, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <tip.icon className="w-4 h-4 text-primary" />
                        </div>
                        <h4 className="font-medium text-foreground">{tip.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
