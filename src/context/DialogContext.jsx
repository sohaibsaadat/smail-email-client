
import React, { createContext, useContext, useState } from "react";
import CustomDialog from "../components/AlertDialogSlide";
const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    onYes: null,
    onNo: null,
  });

  const openDialog = ({
    title,
    message,
    onYes,
    onNo,
  }) => {
    setDialog({
      open: true,
      title,
      message,
      onYes,
      onNo,
    });
  };

  const closeDialog = () => {
    setDialog((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleYes = () => {
    if (dialog.onYes) {
      dialog.onYes();
    }

    closeDialog();
  };

  const handleNo = () => {
    if (dialog.onNo) {
      dialog.onNo();
    }

    closeDialog();
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      <CustomDialog
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        onYes={handleYes}
        onNo={handleNo}
        onClose={closeDialog}
      />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  return useContext(DialogContext);
};

