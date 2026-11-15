/** Read untrusted JSON with an actual byte cap even if Content-Length is missing or forged. */
export async function readLimitedJson(request:Request,maxBytes:number):Promise<unknown>{
  if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))throw new Error('Only JSON requests are supported');
  if(!request.body)throw new Error('Missing request body');
  const reader=request.body.getReader();const chunks:Uint8Array[]=[];let size=0;
  try{
    while(true){
      const {done,value}=await reader.read();if(done)break;
      size+=value.byteLength;
      if(size>maxBytes)throw new Error('Request body too large');
      chunks.push(value);
    }
  }finally{reader.releaseLock();}
  if(!size)throw new Error('Empty request');
  return JSON.parse(Buffer.concat(chunks.map(chunk=>Buffer.from(chunk))).toString('utf8'));
}
