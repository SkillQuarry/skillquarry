export type PracticeProblem = {
  id: string
  topicId: string
  prompt: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export type PracticeSubmission = {
  problemId: string
  answer: string
  submittedAt: string
}
