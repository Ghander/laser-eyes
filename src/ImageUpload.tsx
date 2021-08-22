import { LATEST_VERSION } from "lsat-js"
import { useEffect, useState } from "react"
import logo1 from './content/1.png'
import logo2 from './content/2.png'
import logo3 from './content/3.png'

export const ImageUpload = (props: any) => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState('')
    const [selectedImg, setSelectedImg] = useState('')
    const [lasers, setLasers] = useState<Array<any>>([])

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

    const onPay = () => {

    }

    return (
        <div>
            <div className="upload-container mt-3">
                {selectedFile ?
                    <div onClick={onDropLaserEye}>
                        <img className="main-img" src={preview} />
                        {selectedImg &&
                            <div>
                                <img className="laser-img" src={selectedImg} style={{ position: 'fixed', top: 400, right: 740, zIndex: 999 }} />
                                <img className="laser-img" src={selectedImg} style={{ position: 'fixed', top: 395, right: 683, zIndex: 999 }} />
                                <img className="laser-img" src={selectedImg} style={{ position: 'fixed', top: 396, right: 605, zIndex: 999 }} />
                                <img className="laser-img" src={selectedImg} style={{ position: 'fixed', top: 385, right: 557, zIndex: 999 }} />
                            </div>
                        }
                    </div> :
                    <div className="skeleton-loader"></div>}
                <div className="input-group mt-3 mb-3">
                    <input type="file" onChange={onSelectFile} className="form-control" id="inputGroupFile02" />
                    <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                </div>
            </div>
            <div className="text-center mb-3">
                <button type="button" onClick={onPay} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Unlock Component</button>
            </div>
            <div className="mt-3">
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
            </div>

            <div className="modal fade" id="exampleModal" tabIndex={1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}