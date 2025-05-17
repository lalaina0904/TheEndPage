import { NextResponse } from "next/server";
import { S3Client,PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client=new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

async function uploadFileToS3(file:Buffer,filename:string) {
    const fileBuffer = file;
    const params={
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: filename+Date.now(),
        Body: fileBuffer,
    }
    const command=new PutObjectCommand(params);
    await s3Client.send(command);
    return filename
}

export async function POST(req: Request) {
    
try{
const formData=await req.formData();
const file=formData.get("file") as File;
const buffer=Buffer.from(await file.arrayBuffer());
const filename=await uploadFileToS3(buffer,file.name)
return NextResponse.json({filename}, {status:200})
}catch(error){
return NextResponse.json({error:"Erreur lors de l'upload du fichier"}, {status:500})
}
}