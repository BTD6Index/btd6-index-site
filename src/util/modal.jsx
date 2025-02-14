import { useState } from "react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "../modal.css";

export default function RulesModal({challenge, rules }) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
        <span>
            <Button disableRipple={true} className='modal-open-btn' color='white' variant="contained" onClick={handleOpen}>Rules</Button>
            <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description' className='modal' >
                <Box className='modal-box'>
                    <div className='modal-header'>
                        <h1 className='modal-title'>{challenge.toString().toUpperCase()} Rules</h1>
                        <Button color='third' variant='contained' className='btn-close' onClick={handleClose} startIcon={<CloseIcon />} > Close </Button>
                    </div>
                    <hr className='modal-break'/>
                    <div className='modal-body'>
                        {rules.map((rule) => {return rule.rule})}
                    </div>
                    <hr className='modal-break'/>
                    <div className='modal-footer'>
                        <Button color='third' variant='contained' className='btn-close' onClick={handleClose} startIcon={<CloseIcon />} > Close </Button>
                    </div>
                </Box>
            </Modal>
        </span>
	);
}
