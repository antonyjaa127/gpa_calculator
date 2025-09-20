// GPA Hesaplama Utilleri

export const gradeMap: Record<string, number> = {
  "AA": 4.0,
  "BA": 3.5,
  "BB": 3.0,
  "CB": 2.5,
  "CC": 2.0,
  "DC": 1.5,
  "DD": 1.0,
  "FF": 0.0
};

export function convertGrade(gradeInput: string | number): number {
  const grade = String(gradeInput).trim().toUpperCase();
  
  if (grade in gradeMap) {
    return gradeMap[grade];
  }
  
  const numericGrade = parseFloat(grade);
  if (isNaN(numericGrade)) {
    throw new Error(`Geçersiz not girişi: ${gradeInput}`);
  }
  
  if (numericGrade < 0.0 || numericGrade > 4.0) {
    throw new Error(`Not 0.0 ile 4.0 arasında olmalıdır: ${numericGrade}`);
  }
  
  return numericGrade;
}

export interface Course {
  grade: string | number;
  credit: number;
}

export function calculateTermGPA(courses: Course[]): number {
  if (courses.length === 0) {
    return 0.0;
  }
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  for (const course of courses) {
    const gradePoint = convertGrade(course.grade);
    totalPoints += gradePoint * course.credit;
    totalCredits += course.credit;
  }
  
  if (totalCredits === 0) {
    return 0.0;
  }
  
  return totalPoints / totalCredits;
}

export function calculateCumulativeGPA(
  existingGPA: number,
  existingCredits: number,
  newCourses: Course[]
): number {
  const prevTotalPoints = existingGPA * existingCredits;
  
  let newTotalPoints = 0;
  let newTotalCredits = 0;
  
  for (const course of newCourses) {
    const gradePoint = convertGrade(course.grade);
    newTotalPoints += gradePoint * course.credit;
    newTotalCredits += course.credit;
  }
  
  const updatedTotalPoints = prevTotalPoints + newTotalPoints;
  const updatedTotalCredits = existingCredits + newTotalCredits;
  
  if (updatedTotalCredits === 0) {
    return 0.0;
  }
  
  return updatedTotalPoints / updatedTotalCredits;
}

export interface GPAResult {
  termGPA: number;
  cumulativeGPA: number;
}

export function calculateBothGPA(
  existingGPA: number | null,
  existingCredits: number,
  newCourses: Course[]
): GPAResult {
  const termGPA = calculateTermGPA(newCourses);
  
  if (!existingGPA || existingCredits === 0) {
    return {
      termGPA,
      cumulativeGPA: termGPA
    };
  }
  
  const cumulativeGPA = calculateCumulativeGPA(existingGPA, existingCredits, newCourses);
  
  return {
    termGPA,
    cumulativeGPA
  };
}
