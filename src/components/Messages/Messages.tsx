import {Alert, AlertColor, Slide, Snackbar} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setMessage} from "../../store/uiSlice";

export default function Messages(props: {autoHideDuration: number}) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('success');
    const message = useSelector((state: RootState) => state.ui.message);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!message) {
            setOpen(false);
            return;
        }
            
        setText(message.text);
        setSeverity(message.isError ? 'error' : 'success');
        setOpen(true);
        
    }, [message]);

    const handleClose = () => {
        setOpen(false);
        dispatch(setMessage());
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={props.autoHideDuration}
            onClose={handleClose}
            TransitionComponent={p => <Slide {...p} direction="left"  children={p.children}/>}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {text}
            </Alert>
        </Snackbar>
    )
}