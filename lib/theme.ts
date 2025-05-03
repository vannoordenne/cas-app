export type ColorScheme = {
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  borderHover: string;
  background: string;
  backgroundHover: string;
}

export const teacherTheme: ColorScheme = {
  primary: '#42ff00',
  secondary: '#9fff1a',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  border: '#42ff00/20',
  borderHover: '#42ff00/40',
  background: '#000000',
  backgroundHover: '#42ff00/10'
}

export const studentTheme: ColorScheme = {
  primary: '#ffffff',
  secondary: '#e0e0e0',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  border: '#ffffff/20',
  borderHover: '#ffffff/40',
  background: '#000000',
  backgroundHover: '#ffffff/10'
}

export const getTheme = (role: 'STUDENT' | 'TEACHER' | null): ColorScheme => {
  return teacherTheme;
} 