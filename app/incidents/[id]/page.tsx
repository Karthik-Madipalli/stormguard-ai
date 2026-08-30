import StormGuardRoutePage from '@/components/stormguard-route-page'
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <StormGuardRoutePage kind="incident" id={id}/>} 
