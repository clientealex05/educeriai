// Mock database for demo purposes
export type UserRole = "student" | "teacher" | "parent"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  studentId?: string // For parents to link to their child
}

export interface Student {
  id: string
  name: string
  grade: string
  avatar?: string
  parentId?: string
}

export interface Subject {
  id: string
  name: string
  grade: string
  curriculum: string[]
}

export interface Grade {
  id: string
  studentId: string
  subjectId: string
  score: number
  maxScore: number
  date: string
  term: string
}

export interface BehaviorRecord {
  id: string
  studentId: string
  date: string
  category: "participation" | "behavior" | "homework" | "attendance"
  rating: number // 1-5
  notes: string
}

export interface AIRecommendation {
  id: string
  studentId: string
  type: "learning-path" | "resource" | "reinforcement"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  subjectId?: string
}

// Mock data
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Prof. Karina García",
    email: "karina@ceri.edu.co",
    role: "teacher",
    avatar: "/diverse-classroom-teacher.png",
  },
  {
    id: "u2",
    name: "Valeria Orozco",
    email: "valeria@ceri.edu.co",
    role: "student",
    avatar: "/student-boy.jpg",
  },
  {
    id: "u3",
    name: "Ana Martínez",
    email: "ana@papas.com",
    role: "parent",
    studentId: "s1",
    avatar: "/loving-parent.png",
  },
]

export const mockStudents: Student[] = [
  { id: "s1", name: "Valeria Orozco", grade: "9", avatar: "/student-girl-vale.jpg", parentId: "u3" },
  { id: "s2", name: "Laura Fernández", grade: "9", avatar: "/student-girl.jpg" },
  { id: "s3", name: "Diego Morales", grade: "11", avatar: "/student-boy.jpg" },
  { id: "s4", name: "Andrés López", grade: "6", avatar: "/student-boy-2.jpg" },
]

export const mockSubjects: Subject[] = [
  {
    id: "sub1",
    name: "Matemáticas",
    grade: "10",
    curriculum: ["Álgebra lineal", "Funciones cuadráticas", "Trigonometría", "Geometría analítica"],
  },
  {
    id: "sub2",
    name: "Ciencias Naturales",
    grade: "10",
    curriculum: ["Biología celular", "Química orgánica", "Física mecánica", "Ecosistemas"],
  },
  {
    id: "sub3",
    name: "Español",
    grade: "10",
    curriculum: ["Análisis literario", "Gramática avanzada", "Redacción", "Literatura latinoamericana"],
  },
  {
    id: "sub4",
    name: "Historia",
    grade: "10",
    curriculum: ["Historia mundial", "Historia de América", "Civilizaciones antiguas", "Siglo XX"],
  },
]

export const mockGrades: Grade[] = [
  { id: "g1", studentId: "s1", subjectId: "sub1", score: 98, maxScore: 100, date: "2025-01-15", term: "Q1" },
  { id: "g2", studentId: "s1", subjectId: "sub2", score: 69, maxScore: 100, date: "2025-01-16", term: "Q1" },
  { id: "g3", studentId: "s1", subjectId: "sub3", score: 95, maxScore: 100, date: "2025-01-17", term: "Q1" },
  { id: "g4", studentId: "s1", subjectId: "sub4", score: 97, maxScore: 100, date: "2025-01-18", term: "Q1" },
  { id: "g5", studentId: "s2", subjectId: "sub1", score: 75, maxScore: 100, date: "2025-01-15", term: "Q1" },
  { id: "g6", studentId: "s2", subjectId: "sub2", score: 50, maxScore: 100, date: "2025-01-16", term: "Q1" },
  { id: "g7", studentId: "s2", subjectId: "sub3", score: 90, maxScore: 100, date: "2025-01-17", term: "Q1" },
  { id: "g8", studentId: "s3", subjectId: "sub1", score: 79, maxScore: 100, date: "2025-01-15", term: "Q1" },
  { id: "g9", studentId: "s3", subjectId: "sub2", score: 68, maxScore: 100, date: "2025-01-16", term: "Q1" },
  { id: "g10", studentId: "s3", subjectId: "sub3", score: 63, maxScore: 100, date: "2025-01-18", term: "Q1" },
  { id: "g11", studentId: "s3", subjectId: "sub4", score: 73, maxScore: 100, date: "2025-01-18", term: "Q1" },
  { id: "g12", studentId: "s4", subjectId: "sub2", score: 38, maxScore: 100, date: "2025-01-16", term: "Q1" },
  { id: "g13", studentId: "s4", subjectId: "sub2", score: 88, maxScore: 100, date: "2025-01-18", term: "Q1" },
]

export const mockBehavior: BehaviorRecord[] = [
  {
    id: "b1",
    studentId: "s1",
    date: "2025-01-20",
    category: "participation",
    rating: 4,
    notes: "Excelente participación en clase",
  },
  {
    id: "b2",
    studentId: "s1",
    date: "2025-01-21",
    category: "homework",
    rating: 5,
    notes: "Todas las tareas completadas",
  },
  { id: "b3", studentId: "s1", date: "2025-01-22", category: "behavior", rating: 5, notes: "Comportamiento ejemplar" },
  { id: "b4", studentId: "s1", date: "2025-01-23", category: "attendance", rating: 4, notes: "Buena asistencia" },
]

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: "ai1",
    studentId: "s1",
    type: "reinforcement",
    title: "Refuerzo en Ciencias Naturales",
    description:
      "Se detectó que necesitas apoyo adicional en química orgánica. Te recomendamos videos interactivos y ejercicios prácticos.",
    priority: "high",
    subjectId: "sub2",
  },
  {
    id: "ai2",
    studentId: "s1",
    type: "learning-path",
    title: "Ruta de Aprendizaje Personalizada",
    description:
      "Basado en tu estilo de aprendizaje visual, hemos creado una ruta con diagramas, mapas conceptuales y videos.",
    priority: "medium",
  },
  {
    id: "ai3",
    studentId: "s1",
    type: "resource",
    title: "Recursos Recomendados",
    description: "Khan Academy - Química Orgánica, Crash Course - Biología Celular, PhET Simulations",
    priority: "medium",
    subjectId: "sub2",
  },
]

// Helper functions
export function getStudentGrades(studentId: string): Grade[] {
  return mockGrades.filter((g) => g.studentId === studentId)
}

export function getStudentBehavior(studentId: string): BehaviorRecord[] {
  return mockBehavior.filter((b) => b.studentId === studentId)
}

export function getStudentRecommendations(studentId: string): AIRecommendation[] {
  return mockAIRecommendations.filter((r) => r.studentId === studentId)
}

export function getSubjectById(subjectId: string): Subject | undefined {
  return mockSubjects.find((s) => s.id === subjectId)
}

export function getStudentById(studentId: string): Student | undefined {
  return mockStudents.find((s) => s.id === studentId)
}

export function calculateAverage(grades: Grade[]): number {
  if (grades.length === 0) return 0
  const sum = grades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0)
  return Math.round(sum / grades.length)
}
