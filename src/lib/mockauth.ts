export const mockUsers = [
  {
    id: "user_1",
    email: "recruiter@example.com",
    password: "password123",
    name: "John Recruiter",
    role: "recruiter" as const,
  },
  {
    id: "user_2",
    email: "applicant@example.com",
    password: "password123",
    name: "Jane Applicant",
    role: "applicant" as const,
  },
]

export async function mockLogin(email: string, password: string) {
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

// Mock signup function - Replace with your API call
export async function mockSignup(email: string, password: string, name: string, role: "recruiter" | "applicant") {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const existingUser = mockUsers.find((u) => u.email === email)
  if (existingUser) {
    throw new Error("Email already exists")
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    password,
    name,
    role,
  }

  mockUsers.push(newUser)

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  }
}

// Mock logout function
export async function mockLogout() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
}
