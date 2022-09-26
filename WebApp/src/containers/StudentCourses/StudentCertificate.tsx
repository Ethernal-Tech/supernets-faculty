import React, {useState, useEffect, useMemo} from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { loadStudentCertificateAction } from 'actions/certificateActions'
import { emptyArray } from 'utils/commonHelper'
import { useParams } from 'react-router-dom'
import { address } from 'planBCertificate'
import './dotted.table.scss'

class Metadata {
	name!: string
	description!: string
	attributes!: Attribute[]
}

class Attribute {
    trait_type!: string
    value!: string
}

function StudentCertificate() {
	const dispatch = useDispatch()
	const params: any = useParams();
	const studentId = params.studentId;
	const eventId = params.eventId;

	const state = useSelector((state: any) => state)
    const students = state.users.students || emptyArray
    const student = students.find(stud => stud.id === studentId)

    const [metadata, setMetadata] = useState(new Metadata())
    const certificateData = useMemo(
		() => {
            return (state.certificates || undefined)?.studentCertificates[studentId] || undefined
		},
		[state.certificates.studentCertificates, studentId]
	)

    useEffect(() => {
        if (!certificateData) {
            loadData()
        } else {
            loadMetadata(certificateData.tokenURI)
        }
    }, [certificateData, dispatch])

    const loadData = async () => {
        loadStudentCertificateAction(student.id, eventId, dispatch)
    }

    const loadMetadata = async (uri) => {
        const response = await fetch(uri)
        const metadata = await response.json()
        setMetadata(metadata)
    }

    if (!metadata.name) {
        return (<h1>NFT Metadata is still syncing on IPFS. Please try again later.</h1>)
    }

    return (
        <div style={{ padding: '20px' }} className='text-center col-md-10'>

            <h1>PLAN B CERTIFICATE</h1>
            <h2>{metadata.name}</h2>
            <p>{metadata.description}</p>

            {metadata.attributes.map((attr, ind) => (
                <div className="dotted-data-container">
                    <div className="dotted-data-key">{attr.trait_type}</div>
                    <div className="dotted-data-separator"></div>
                    <div className="dotted-data-value">{attr.value}</div>
                </div>
            ))}

            <p className='text-end' style={{margin: '50px 0 0 0'}}>Contract address: {address} </p>
            <p className='text-end'>NFT ID: {certificateData.tokenId}</p>

        </div>
    )
}

export default StudentCertificate
