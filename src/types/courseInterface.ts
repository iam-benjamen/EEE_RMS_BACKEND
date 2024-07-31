export interface Course {
  id: number;
  course_code: string;
  course_title: string;
  course_description: string;
  course_unit: number;
  course_type: string;
  level: number;
  semester: string;
  course_department: string;
}

export interface courseInput {
  course_code: string;
  course_title: string;
  course_description: string;
  course_unit: number;
  course_type: string;
  level: number;
  semester: string;
  course_department: string;
}
