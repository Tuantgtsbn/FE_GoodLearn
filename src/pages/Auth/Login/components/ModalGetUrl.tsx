import ApiAuth from '@api/ApiAuth';
import { Box, Button, Modal } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface IModelGetUrlProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: string) => void;
}
export default function ModelGetUrl({
  open,
  onClose,
  onConfirm,
}: IModelGetUrlProps) {
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ['auth/google/url'],
    queryFn: ApiAuth.getGoogleLoginUrl,
  });

  const handleOpenWebview = (data?: string) => {
    onClose();
    if (data) {
      onConfirm(data);
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <div className="mb-4">
          {isLoading
            ? 'Loading...'
            : isError
              ? 'Chức năng không khả dụng. Vui lòng thử lại sau.'
              : 'Đăng nhập bằng Google'}
        </div>
        {isError ? (
          <div className="ml-auto w-max space-x-4">
            <Button color="error" variant="contained" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="contained" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <div>
            <Button
              disabled={isLoading || !data}
              variant="contained"
              className="w-full"
              onClick={() => handleOpenWebview(data?.url)}
            >
              Xác nhận
            </Button>
          </div>
        )}
      </Box>
    </Modal>
  );
}
