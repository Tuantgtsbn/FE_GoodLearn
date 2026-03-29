import { Box, Modal, SxProps, Theme } from '@mui/material';
import { X } from 'lucide-react';
import { JSX } from 'react';

const style: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  boxShadow: 24,
  width: {
    xs: '90%',
    lg: '752px',
  },
  p: 4,
  borderRadius: '8px',
};

interface IModalProps {
  open?: boolean;
  onClose?: () => void;
  children?: JSX.Element;
  title?: string;
  isLoading?: boolean;
  onOk?: () => void;
  customStyle?: SxProps<Theme>;
}

export default function CommonModal({
  open = false,
  onClose,
  children,
  title,
  customStyle,
}: IModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        backdropFilter: 'blur(6px)',
      }}
    >
      <Box sx={{ ...style, ...customStyle } as SxProps<Theme>}>
        {/* Header */}
        <div className="flex py-2 items-center gap-6">
          <span className="text-lg md:text-xl lg:text-2xl font-bold flex-1 truncate">
            {title}
          </span>
          <X size={20} className="cursor-pointer" onClick={onClose} />
        </div>
        <hr className="bg-[#F0F0F0] mb-5" />
        {/* Content */}
        {children}
      </Box>
    </Modal>
  );
}
