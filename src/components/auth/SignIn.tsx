import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Copyright} from "../Copyright";
import {useSignin} from "./hooks";
import * as Yup from "yup";
import {useState} from "react";
import useYup from "../../hooks/use-yup";

interface FormType {
    email: string,
    password: string,
}

const defaultState: FormType = {
    email: '',
    password: '',
}

const validationSchema: Yup.SchemaOf<FormType> =
    Yup.object({
        email: Yup.string().required().email(),
        password: Yup.string().required(),
    });

export default function SignIn(props: { switchToSignup: () => void }) {
    const {handleSubmit} = useSignin();
    const [formState, setFormState] = useState<FormType>(defaultState);
    const [validateOnChange, setValidateOnChange] = useState(false);
    const { errors: validationMessages, validate } = useYup(formState, validationSchema, {
        validateOnChange: validateOnChange
    })

    const onSubmithandler = async (event: any) => {
        event.preventDefault();

        const { isValid } = await validate()

        if (!isValid) {
            setValidateOnChange(true);
            return;
        }

        await handleSubmit({
            email: formState.email,
            password: formState.password,
        });
    }

    const onChangeHandler = (update: Partial<FormType>) => {
        setFormState(prevState => ({...prevState, ...update}));
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={onSubmithandler} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => onChangeHandler({email: e.target.value})}
                                error={!!validationMessages.email}
                                helperText={validationMessages.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={(e) => onChangeHandler({password: e.target.value})}
                                error={!!validationMessages.password}
                                helperText={validationMessages.password}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2" onClick={props.switchToSignup}>
                                Do not have an account? Sign up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{mt: 5}}/>
        </Container>
    );
}