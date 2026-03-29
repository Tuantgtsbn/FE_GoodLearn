import { z } from 'zod';

export const LoginDto = z.object({
  email: z
    .string()
    .min(1, 'Email bắt buộc')
    .email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginDataDto = z.infer<typeof LoginDto>;

export const accountRegisterDto = z
  .object({
    username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
    email: z.email({ error: 'Email không hợp lệ' }),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Mật khẩu và xác nhận mật khẩu không khớp',
    path: ['confirmPassword'],
  });

export const infoRegisterDto = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Ngày sinh không hợp lệ'),
  gender: z
    .string()
    .refine((val) => ['male', 'female', 'other'].includes(val.toLowerCase()), {
      message: 'Giới tính không hợp lệ',
    }),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
  bio: z.string().optional(),
  gradeLevel: z.coerce.number().optional(),
});

export const addressRegisterDto = z.object({
  address: z.object({
    detail: z.string().min(1, 'Địa chỉ chi tiết là bắt buộc'),
    ward: z.object({
      name: z.string().min(1, 'Phường/Xã là bắt buộc'),
      code: z.string(),
    }),
    district: z.string().optional(),
    city: z.object({
      name: z.string().min(1, 'Tỉnh/Thành phố là bắt buộc'),
      code: z.string(),
    }),
    country: z.string().min(1, 'Quốc gia là bắt buộc'),
  }),
});

export const RegisterUserDto = accountRegisterDto
  .safeExtend(infoRegisterDto.shape)
  .safeExtend(addressRegisterDto.shape);

export type RegisterUserDataDto = z.infer<typeof RegisterUserDto>;
