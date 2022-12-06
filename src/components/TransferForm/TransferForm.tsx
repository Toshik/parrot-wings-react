import * as React from 'react';
import {FormEvent, useCallback, useEffect, useMemo, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Title from "../Title";
import {useTransferFunds} from "../Dashboard/hooks";
import {useSearchUser} from "./hooks";
import {Autocomplete} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {
    setTransferDraft, setTransferState, updateTransferDraftUsername,
    updateTransferStateAmount,
    updateTransferStateSearchterm,
    updateTransferStateUsername
} from "../../store/uiSlice";
import * as Yup from "yup";
import useYup from "../../hooks/use-yup";

interface OptionType {
    label: string,
    id: string
}

interface FormType {
    username: string,
    amount: number
}

const validationSchema: Yup.SchemaOf<FormType> =
    Yup.object({
        username: Yup.string().required(),
        amount: Yup.number().required().moreThan(0),
        // searchTerm: Yup.string().defined()
    });


export default function TransferForm() {
    const dispatch = useDispatch()
    const {transferFunds} = useTransferFunds();
    const [chosenOption, setChosenOption] = useState<OptionType | null>()
    // const transferDraft = useSelector((state: RootState) => state.ui.transferDraft);
    const amount = useSelector((state: RootState) => state.ui.transferDraft.amount);
    const username = useSelector((state: RootState) => state.ui.transferDraft.username);
    const presetUsername = useSelector((state: RootState) => state.ui.transferDraft.presetUsername);
    const searchTerm = useSelector((state: RootState) => state.ui.transferDraft.searchTerm);
    const balance = useSelector((state: RootState) => state.info.balance);
    const { isLoading, isFetching, list} = useSearchUser({searchTerm: searchTerm});
    const [validateOnChange, setValidateOnChange] = useState(false);
    const formState = useMemo(() => ({amount: amount, username: username}), [amount, username])
    const { errors: validationMessages, validate } = useYup(formState, validationSchema, {
        validateOnChange: validateOnChange
    });

    const optionsList = useMemo(() => {
        return (list || []).map((it: any) => ({label: it.name, id: it.id} as OptionType)) as OptionType[]
    }, [list])

    useEffect(() => {
        const res = optionsList.find((x) => x.label === presetUsername);
        if (!!res) {
            setChosenOption(res);
            dispatch(updateTransferStateUsername(presetUsername));
            dispatch(updateTransferStateSearchterm(presetUsername));
            dispatch(updateTransferDraftUsername(''));
        }
    }, [dispatch, isFetching, isLoading, optionsList, presetUsername])

    const handleSubmit = useCallback(async (event: FormEvent) => {
        event.preventDefault();

        const { isValid } = await validate()

        if (!isValid) {
            setValidateOnChange(true);
            return;
        }

        setValidateOnChange(false);

        transferFunds({name: username, amount: amount});
        dispatch(setTransferState({username: '', searchTerm: '', amount: 1}));
        setChosenOption(null);
    }, [amount, dispatch, transferFunds, username, validate]);

    return (
        <>
            <Title>Transfer funds</Title>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                <Grid container spacing={2}>
                    <Grid item container direction={"row"} spacing={2}>
                        <Grid item xs={8}>
                            <Autocomplete
                                options={optionsList}
                                onChange={(event: any, newValue: { label: string, id: string } | null) => {
                                    console.log('Autocomplete.onChange')
                                    setChosenOption(newValue);
                                    dispatch(updateTransferStateUsername(newValue?.label || ''))
                                    // dispatch(updateTransferDraftSearchterm(newValue?.label || ''))
                                }}
                                getOptionLabel={(option: OptionType) => option.label}
                                isOptionEqualToValue={(option, value) => option.label === value.label}
                                autoSelect
                                value={chosenOption || null}
                                filterOptions={(x) => x}
                                autoComplete
                                // includeInputInList={false}
                                // filterSelectedOptions
                                fullWidth
                                id="recipientName"
                                // inputValue={searchTerm}
                                onInputChange={(e, newValue) => {
                                    dispatch(updateTransferStateSearchterm(newValue))
                                    console.log('new search term:', newValue)
                                }}
                                renderInput={(params) => (
                                    <TextField {...params}
                                               required
                                               label="Recipient name"
                                               name="recipientName"
                                               // onChange={(e) => dispatch(updateTransferDraftSearchterm(e.target.value.toString()))}
                                               error={!!validationMessages.username}
                                               helperText={validationMessages.username}
                                               // value={transferDraft.searchTerm}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                required
                                fullWidth
                                name="amount"
                                label="Amount"
                                type="number"
                                id="amount"
                                inputProps={{min: 1, max: balance}}
                                onChange={(e) => dispatch(updateTransferStateAmount(+e.target.value))}
                                value={amount}
                                error={!!validationMessages.amount}
                                helperText={validationMessages.amount}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                >
                    Transfer
                </Button>
            </Box>
        </>
    );
}