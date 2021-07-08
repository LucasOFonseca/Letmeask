import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  bodyText: string;
  onYesClick: () => void;
  onNoClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ConfirmationDialog({
  open,
  title,
  bodyText,
  onYesClick,
  onNoClick,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogTitle style={{ padding: "16px 0" }}>{title}</DialogTitle>

        <p>{bodyText}</p>

        <DialogActions style={{ marginTop: "1rem" }}>
          <Button
            onClick={() => {
              onYesClick();
              onNoClick(false);
            }}
          >
            sim
          </Button>
          <Button onClick={() => onNoClick(false)}>não</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
