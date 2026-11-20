const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  if (typeof data.quizTitle !== 'string' || data.quizTitle.trim() === '') {
    return false;
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false;
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false;
  }

  const correctAnswersLength = data.correctAnswers.length;

  for (const attempt of data.attempts) {
    if (!attempt || typeof attempt !== 'object' || Array.isArray(attempt)) {
      return false;
    }

    if (typeof attempt.name !== 'string' || attempt.name.trim() === '') {
      return false;
    }

    if (!isArray(attempt.answers) || attempt.answers.length !== correctAnswersLength) {
      return false;
    }
  }

  return true;
}

export function calculateAttempt(attempt, correctAnswers) {
  const name = attempt.name.trim();
  const answers = attempt.answers;
  
  let score = 0;
  for (let i = 0; i < correctAnswers.length; i++) {
    if (answers[i] === correctAnswers[i]) {
      score++;
    }
  }
  
  const percentage = Math.round((score / correctAnswers.length) * 100);
  
  const passed = percentage >= PASSING_PERCENTAGE;
  
  return {
    name,
    score,
    percentage,
    passed
  };
}

export function calculateReport(data) {
  if (!validateQuizData(data)) {
    return null;
  }

  const { quizTitle, correctAnswers, attempts } = data;

  const calculatedAttempts = attempts.map(attempt =>
    calculateAttempt(attempt, correctAnswers)
  );

  const questionCount = correctAnswers.length;
  const participantCount = attempts.length;
  const threshold = PASSING_PERCENTAGE;

  const passedCount = calculatedAttempts.filter(attempt => attempt.passed).length;

  const totalPercentage = calculatedAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0);
  const averagePercentage = Math.round(totalPercentage / participantCount);

  let best = calculatedAttempts[0];
  for (let i = 1; i < calculatedAttempts.length; i++) {
    if (calculatedAttempts[i].score > best.score) {
      best = calculatedAttempts[i];
    }
  }

  return {
    quizTitle: quizTitle.trim(),
    questionCount,
    participantCount,
    averagePercentage,
    passedCount,
    threshold,
    best,
    attempts: calculatedAttempts
  };
}
