"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Brain, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"student" | "teacher" | "parent">("student")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, role)

    // Redirect based on role
    if (role === "teacher") {
      router.push("/teacher")
    } else if (role === "student") {
      router.push("/student")
    } else {
      router.push("/parent")
    }
  }

  const handleQuickDemo = (demoRole: "student" | "teacher" | "parent") => {
    const demoEmails = {
      student: "valeria@ceri.edu.co",
      teacher: "karina@ceri.edu.co",
      parent: "ana@papas.com",
    }
    login(demoEmails[demoRole], demoRole)
    router.push(`/${demoRole}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduCeriAI</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Características
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Acerca de
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Plataforma Educativa con IA
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                Aprendizaje personalizado con <span className="text-primary">Inteligencia Artificial</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Gestión académica inteligente que analiza el rendimiento de cada estudiante y crea rutas de aprendizaje
                personalizadas para maximizar su potencial.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Gestión Académica</h3>
                  <p className="text-sm text-muted-foreground">Notas, asistencia y comportamiento</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">IA Personalizada</h3>
                  <p className="text-sm text-muted-foreground">Rutas de aprendizaje adaptadas</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Reportes Inteligentes</h3>
                  <p className="text-sm text-muted-foreground">Análisis y recomendaciones</p>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground font-medium">Demo Rápido</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Explora la plataforma desde diferentes perspectivas
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4 gap-2 bg-transparent"
                    onClick={() => handleQuickDemo("student")}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-xs">Ver como Estudiante</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4 gap-2 bg-transparent"
                    onClick={() => handleQuickDemo("teacher")}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-xs">Ver como Docente</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4 gap-2 bg-transparent"
                    onClick={() => handleQuickDemo("parent")}
                  >
                    <Brain className="w-5 h-5" />
                    <span className="text-xs">Ver como Padre</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                <CardDescription>Accede a tu cuenta según tu rol</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="student">Estudiante</TabsTrigger>
                    <TabsTrigger value="teacher">Docente</TabsTrigger>
                    <TabsTrigger value="parent">Padre</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={
                          role === "student"
                            ? "valeria@ceri.edu.co"
                            : role === "teacher"
                              ? "karina@ceri.edu.co"
                              : "ana@papas.com"
                        }
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input id="password" type="password" placeholder="••••••••" required />
                    </div>

                    <Button type="submit" className="w-full">
                      Ingresar
                    </Button>

                    <div className="mt-4 p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground font-medium mb-2">Demo - Usuarios de prueba:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>👨‍🎓 Estudiante: valeria@ceri.edu.co</p>
                        <p>👩‍🏫 Docente: karina@ceri.edu.co</p>
                        <p>👨‍👩‍👧 Padre: ana@papas.com</p>
                      </div>
                    </div>
                  </form>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
