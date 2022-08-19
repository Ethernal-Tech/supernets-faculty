const ipfsClient = require('ipfs-http-client');
const client = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http', mode: 'no-cors' });

export const uploadMetadata = async metadata => {
    const metadataJSON = JSON.stringify(metadata);
    console.log(metadataJSON); 

    const buffer = Buffer.from(metadataJSON, 'utf-8');
    try {
        const added = await client.add(buffer)
        console.log('Added path: ', added[0].path)
        return 'ipfs://' + added[0].path
    } catch (error) {
        console.log('Error uploading file: ', error)
    }
}

export const createMetadata = (student, studentCourses) => {
    return {
        name: student.name + "'s PLanBCertificate",
        description: 'This is PLanBCertificate NFT',
        attributes: studentCourses.map(course => {         
            return { 
                value: course.grade,
                trait_type: course.name,
            }
        })
    }
}