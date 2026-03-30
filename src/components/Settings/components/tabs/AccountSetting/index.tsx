import ApiAuth from '@/api/ApiAuth';
import ApiUser from '@/api/ApiUser';
import DatePickerComponent from '@/components/DatePicker';
import ErrorMessage from '@/components/ErrorMessage';
import Avatar from '@/components/ui/Avatar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDialog } from '@/context/DialogContext';
import { logoutUser, updateUser } from '@/redux/slices/AuthSlice';
import type { IRootState } from '@/redux/store';
import type { IUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Lock, PenLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as z from 'zod';

const profileSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên hiển thị'),
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  gender: z.string(),
  dateOfBirth: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  gradeLevel: z
    .number()
    .min(1, 'Lớp phải từ 1 đến 12')
    .max(12, 'Lớp phải từ 1 đến 12'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  bio: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const calculateClassFromBirthday = (birthday: string) => {
  if (!birthday) return 1;
  const birthDate = new Date(birthday);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  // Nếu chưa đến tháng 9 thì coi như vẫn ở tuổi của năm học trước (tính theo niên khóa)
  if (currentDate.getMonth() < 8) {
    age--;
  }

  const grade = age - 5;
  if (grade < 1) return 1;
  if (grade > 12) return 12;
  return grade;
};

export default function AccountSetting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeAll } = useDialog();
  const authUser = useSelector((state: IRootState) => state.auth.user);
  const avatarUrl = authUser?.avatarUrl || '';
  const [avatarPreview, setAvatarPreview] = useState<string>(avatarUrl);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<File | null>(null);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    control: controlProfile,
    setValue: setProfileValue,
    watch: watchProfile,
    formState: { errors: errorsProfile, isDirty: isProfileDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: authUser?.username || '',
      fullName: authUser?.fullName || '',
      gender: authUser?.gender || 'MALE',
      dateOfBirth: authUser?.dateOfBirth || new Date().toISOString(),
      gradeLevel: authUser?.gradeLevel || 1,
      phone: authUser?.phone || '',
      bio: authUser?.bio || '',
    },
  });

  const birthday = watchProfile('dateOfBirth');

  useEffect(() => {
    if (birthday) {
      const calculatedClass = calculateClassFromBirthday(birthday);
      setProfileValue('gradeLevel', calculatedClass, { shouldDirty: true });
    }
  }, [birthday, setProfileValue]);

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: errorsPassword },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const {
    mutate: changePassword,
    isPending: isPendingChangePassword,
    isSuccess: isChangePasswordSuccess,
  } = useMutation({
    mutationFn: (data: PasswordFormValues) => ApiAuth.changePassword(data),
    onSuccess: () => {
      resetPasswordForm();
      toast.success('Cập nhật mật khẩu thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra');
    },
  });

  useEffect(() => {
    if (!isChangePasswordSuccess) {
      return;
    }

    const timerId = window.setTimeout(() => {
      void (async () => {
        try {
          await ApiAuth.logOut();
          closeAll();
        } catch {
          toast.warn('Không thể đăng xuất trên máy chủ. Đã đăng xuất cục bộ.');
        } finally {
          dispatch(logoutUser());
          navigate('/', { replace: true });
        }
      })();
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [dispatch, isChangePasswordSuccess, navigate]);

  const { mutate: updateProfile, isPending: isPendingUpdateProfile } =
    useMutation({
      mutationFn: (data: ProfileFormValues) => {
        const updatedData: Partial<
          Omit<IUser, 'gender'> & { gender: string }
        > & { avatar?: File } = { ...data };
        if (avatarFileRef.current) {
          updatedData.avatar = avatarFileRef.current;
        }
        return ApiUser.updateProfile(updatedData as any);
      },
      onSuccess: (updatedUser) => {
        toast.success('Cập nhật thông tin thành công');
        dispatch(updateUser(updatedUser));
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra');
      },
    });

  const onUpdateProfile = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  const onChangePassword = (data: PasswordFormValues) => {
    changePassword(data);
  };

  const openFileDialog = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setAvatarPreview(URL.createObjectURL(file));
      avatarFileRef.current = file;
    }
  };

  return (
    <div>
      <section className="mb-12">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary dark:text-white">
            Thông tin cá nhân
          </h3>
          <p className="text-sm text-slate-500">
            Cập nhật thông tin hồ sơ và địa chỉ email của bạn.
          </p>
        </div>
        <form
          onSubmit={handleSubmitProfile(onUpdateProfile)}
          className="flex flex-col gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-primary dark:border-white overflow-hidden bg-zinc-100">
                <Avatar
                  src={avatarPreview}
                  className="w-full h-full object-cover"
                  name={authUser?.fullName || ''}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <button
                type="button"
                onClick={openFileDialog}
                className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-white shadow-sm flex items-center justify-center"
              >
                <PenLine size={16} />
              </button>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Ảnh đại diện</h4>
              <p className="text-xs text-slate-500 mb-3">
                JPG, GIF hoặc PNG. Tối đa 2MB.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="px-3 py-1.5 text-xs font-bold border border-border-muted rounded bg-white hover:bg-zinc-50 transition-colors"
                >
                  Tải lên
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (avatarInputRef.current)
                      avatarInputRef.current.value = '';
                    setAvatarPreview(avatarUrl);
                    avatarFileRef.current = null;
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors rounded"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Tên hiển thị
              </label>
              <input
                className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all font-medium"
                type="text"
                {...registerProfile('username')}
              />
              {errorsProfile.username && (
                <ErrorMessage message={errorsProfile.username.message} />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Email (Không thể thay đổi)
              </label>
              <div className="flex items-center gap-2 w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-border-muted dark:border-zinc-800 rounded-lg text-slate-500 italic">
                <Lock size={16} />
                <span>{authUser?.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Họ và tên
            </label>
            <input
              className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all font-medium"
              type="text"
              {...registerProfile('fullName')}
            />
            {errorsProfile.fullName && (
              <ErrorMessage message={errorsProfile.fullName.message} />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Giới tính
            </label>
            <Controller
              control={controlProfile}
              name="gender"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 focus:border-primary dark:focus:border-white focus:ring-0 transition-all font-medium">
                    <SelectValue placeholder="Giới tính" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="w-full">
                    <SelectGroup>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errorsProfile.gender && (
              <ErrorMessage message={errorsProfile.gender.message} />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Ngày sinh
            </label>
            <Controller
              control={controlProfile}
              name="dateOfBirth"
              render={({ field }) => (
                <DatePickerComponent
                  value={field.value || null}
                  onChange={(date) => field.onChange(date?.toISOString())}
                  config={{
                    maxDate: new Date().toISOString(),
                  }}
                />
              )}
            />
            {errorsProfile.dateOfBirth && (
              <ErrorMessage message={errorsProfile.dateOfBirth.message} />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Lớp
            </label>
            <input
              className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all font-medium bg-zinc-50 cursor-not-allowed"
              type="number"
              readOnly
              {...registerProfile('gradeLevel')}
            />
            {errorsProfile.gradeLevel && (
              <ErrorMessage message={errorsProfile.gradeLevel.message} />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Số điện thoại
            </label>
            <input
              className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all font-medium"
              type="text"
              {...registerProfile('phone')}
            />
            {errorsProfile.phone && (
              <ErrorMessage message={errorsProfile.phone.message} />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Thông tin tiểu sử
            </label>
            <textarea
              className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all font-medium"
              rows={4}
              placeholder="Môn học sở trường của bạn là gì?"
              {...registerProfile('bio')}
            />
            {errorsProfile.bio && (
              <ErrorMessage message={errorsProfile.bio.message} />
            )}
          </div>
          <button
            type="submit"
            disabled={
              isPendingUpdateProfile ||
              (!isProfileDirty && !avatarFileRef?.current)
            }
            className="w-fit px-6 py-2.5 bg-primary disabled:bg-gray-300 dark:bg-white text-white dark:text-primary font-bold rounded-lg custom-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            Lưu thay đổi
          </button>
        </form>
      </section>
      <hr className="border-border-muted dark:border-zinc-800 mb-12" />
      <section className="mb-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary dark:text-white">
            Bảo mật &amp; Mật khẩu
          </h3>
          <p className="text-sm text-slate-500">
            Quản lý mật khẩu và các tùy chọn bảo mật tài khoản.
          </p>
        </div>
        <form
          onSubmit={handleSubmitPassword(onChangePassword)}
          className="grid gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Mật khẩu hiện tại
              </label>
              <input
                className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all"
                placeholder="••••••••"
                type="password"
                {...registerPassword('currentPassword')}
              />
              {errorsPassword.currentPassword && (
                <ErrorMessage
                  message={errorsPassword.currentPassword.message}
                />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Mật khẩu mới
              </label>
              <input
                className="w-full px-4 py-2.5 border-2 border-border-muted dark:border-zinc-800 rounded-lg focus:border-primary dark:focus:border-white focus:ring-0 transition-all"
                placeholder="••••••••"
                type="password"
                {...registerPassword('newPassword')}
              />
              {errorsPassword.newPassword && (
                <ErrorMessage message={errorsPassword.newPassword.message} />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isPendingChangePassword}
            className="w-fit px-6 py-2.5 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-lg custom-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </section>
    </div>
  );
}
