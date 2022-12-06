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
import {useSignup} from "./hooks";
import {Copyright} from "../Copyright";
import {useState} from "react";
import * as Yup from "yup";
import useYup from "../../hooks/use-yup";

interface FormType {
    email: string,
    username: string,
    password: string,
    password2: string
}

const defaultState: FormType = {
    email: '',
    username: '',
    password: '',
    password2: '',
}

const validationSchema: Yup.SchemaOf<FormType> =
    Yup.object({
        email: Yup.string().required().email(),
        username: Yup.string().required(),
        password: Yup.string().required(),
        password2: Yup.string().required().oneOf([Yup.ref('password'), null], 'Passwords do not match')
    });

export default function SignUp(props: { switchToLogin: () => void }) {
    const {handleSubmit} = useSignup();
    // const [isFormValid, setIsFormValid] = useState(true);
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

        handleSubmit({
            email: formState.email,
            username: formState.username,
            password: formState.password,
            password2: formState.password2
        });
    }



/*
    const validates = useCallback(async () => {

        const user = await validationSchema. validate(formState);

        console.log(user);
        return;
        setIsFormValid(true);
        setValidationMessages({});

        if (formState.password !== formState.password2) {
            setValidationMessages((prevState) => (
                {
                    ...prevState,
                    password: 'Passwords do not match',
                    password2: 'Passwords do not match'
                }));
            setIsFormValid(false);
        }

        if (formState.password.length === 0) {
            setValidationMessages((prevState) => (
                {
                    ...prevState,
                    password: 'Password is required',
                }));
            setIsFormValid(false);
        }

        if (formState.email.length === 0) {
            setValidationMessages((prevState) => (
                {
                    ...prevState,
                    email: 'Email is required',
                }));
            setIsFormValid(false);
        }

        if (formState.username.length === 0) {
            setValidationMessages((prevState) => (
                {
                    ...prevState,
                    username: 'Username is required',
                }));
            setIsFormValid(false);
        }

    }, [formState.email.length, formState.password, formState.password2, formState.username.length]);
*/

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
                                id="username"
                                label="User name"
                                name="username"
                                autoComplete="username"
                                onChange={(e) => onChangeHandler({username: e.target.value})}
                                error={!!validationMessages.username}
                                helperText={validationMessages.username}
                            />
                        </Grid>
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
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password2"
                                label="Repeat Password"
                                type="password"
                                id="password2"
                                autoComplete="new-password"
                                onChange={(e) => onChangeHandler({password2: e.target.value})}
                                error={!!validationMessages.password2}
                                helperText={validationMessages.password2}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        // disabled={!isFormValid}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2" onClick={props.switchToLogin}>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{mt: 5}}/>
        </Container>
    );
}