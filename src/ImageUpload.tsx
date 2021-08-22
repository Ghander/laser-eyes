import { Lsat } from "lsat-js"
import { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import logo1 from './content/1.png'
import logo2 from './content/2.png'
import logo3 from './content/3.png'
import check from './content/check.jpg'
const QRCode = require('qrcode.react');

export const ImageUpload = (props: any) => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState('')
    const [selectedImg, setSelectedImg] = useState('')
    const [lasers, setLasers] = useState<Array<any>>([])
    const [invoice, setInvoice] = useState<string | undefined>();
    const [success, setSuccess] = useState<boolean>(false);

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview('')
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    const onSelectImage = (imgNum: number) => {
        let img = '';
        switch (imgNum) {
            case 1:
                img = logo1;
                break;
            case 2:
                img = logo2;
                break;
            case 3:
                img = logo3;
                break;
        }
        setSelectedImg(img);
    }

    const onDropLaserEye = (e: any) => {
        console.log(lasers)
        setLasers(lasers => [...lasers, { top: e.pageY, right: e.pageX }]);
    }

    const getPreimage = () => {
        return '';
    }

    const handleFetch = () => {
        // fetching a protected route which will return a 402 response and LSAT challenge
        fetch('https://lsat-workshop.vercel.app/api/question')
            .then((resp: any) => {
                const header = resp.headers.get('www-authenticate')
                const lsat = Lsat.fromHeader(header)

                // show some information about the lsat

                console.log(lsat.invoice)
                setInvoice(lsat.invoice)
                handleShow();
                console.log(lsat.baseMacaroon)
                console.log(lsat.paymentHash)

                // after the invoice is paid, you can add the preimage
                // this is just a stub for getting the preimage string
                const preimage = getPreimage()
                beginWait()
                // this will validate that the preimage is valid and throw if not
                lsat.setPreimage(preimage)

                return fetch('https://lsat-workshop.vercel.app/api/question', {
                    headers: {
                        'Authorization': lsat.toToken()
                    }
                })
            })
            .then((resp: any) => resp.json())
            .then((json: string) => {
                console.log('With valid LSAT, we should get a response:', json)
            })
            .catch((e: any) => {
                console.log(e)
            })
    }

    const beginWait = () => {
        setTimeout(() => { setSuccess(true) }, 20000);
    }

    return (
        <div>
            <div className="upload-container mt-3">
                {selectedFile ?
                    <div onClick={onDropLaserEye}>
                        <div className="text-center">
                            <img className="main-img" src={preview} />
                        </div>
                        {selectedImg &&
                            <div>
                                <img className="laser-img" src={selectedImg} style={{ position: 'fixed', top: 400, right: 950, zIndex: 999 }} />
                                <img className="laser-img" src={selectedImg} style={{ position: 'fixed', top: 395, right: 893, zIndex: 999 }} />
                                <img className="laser-img" src={selectedImg} style={{ position: 'fixed', top: 396, right: 819, zIndex: 999 }} />
                                <img className="laser-img" src={selectedImg} style={{ position: 'fixed', top: 385, right: 765, zIndex: 999 }} />
                            </div>
                        }
                    </div> :
                    <div className="skeleton-loader"></div>}
                <div className="input-group mt-3 mb-3 d-flex justify-content-center">
                    <div style={{ maxWidth: 400 }}>
                        <input type="file" onChange={onSelectFile} className="form-control" id="inputGroupFile02" />
                    </div>
                </div>
            </div>
            {!success && <div className="text-center mb-3">
                <Button variant="primary" onClick={handleFetch}>Unlock Component</Button>
            </div>}
            {success && <div className="mt-3 component">
                <div className="form-check form-check-inline">
                    <img className="laser-img" src={logo1} alt="" />
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" onClick={() => onSelectImage(1)} />
                </div>
                <div className="form-check form-check-inline">
                    <img className="laser-img" src={logo2} alt="" />
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" onClick={() => onSelectImage(2)} />
                </div>
                <div className="form-check form-check-inline">
                    <img className="laser-img" src={logo3} alt="" />
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" onClick={() => onSelectImage(3)} />
                </div>
            </div>}

            <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Pay 1000 Sats with Lightning</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {success ? <img src={check} alt="" /> : <QRCode value={invoice} size={400}></QRCode>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}