export const initialData = {
  projects: [
    {
      id: 1,
      name: "Android App",
      tasks: [
        { id: 11, name: "Implement login", done: true },
        { id: 12, name: "Add push notifications", done: false },
        { id: 13, name: "Fix memory leak", done: false },
      ]
    },
    {
      id: 2,
      name: "Web Dashboard",
      tasks: [
        { id: 21, name: "Create charts", done: false },
        { id: 22, name: "Write API docs", done: true },
        { id: 23, name: "Add dark mode", done: false },
      ]
    },
    {
      id: 3,
      name: "Backend API",
      tasks: [
        { id: 31, name: "Implement JWT", done: true },
        { id: 32, name: "Rate limiting", done: false },
      ]
    },
    {
      id: 4,
      name: "iOS App",
      tasks: [
        { id: 41, name: "Push Notifications", done: true },
        { id: 42, name: "Apple Pay Support", done: false },
        { id: 43, name: "SwiftUI migration", done: false },
      ]
    }
  ]
};