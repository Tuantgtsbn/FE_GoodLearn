import z from 'zod';

export const ContactDto = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^\d+$/, 'Số điện thoại chỉ được chứa số'),
  subject: z.string().optional(),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
});

export type ContactDataDto = z.infer<typeof ContactDto>;
