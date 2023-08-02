import React from 'react'
import { useLocation } from "react-router-dom"
import { PDFViewer,Document, Text, Page, StyleSheet, Svg, Line, Image, View } from '@react-pdf/renderer';
import { CarregaRelatorio } from '../../config/utils';

export function LoadRelatorio({navigate}){
    const { search }= useLocation()

    function GoToRelatorio(){
        let params = search.replace(/%22/g,'"').split('?')
        sessionStorage.setItem('token',params[2].substring(params[2].indexOf('=')+1)) 
        let query = JSON.parse(params[1])
        CarregaRelatorio(()=>{},navigate,query,true)
    }

    return(
        <div>{GoToRelatorio()}</div>
    )
}

export default function Relatorios(){
    const {dados} = useLocation().state
    const {pesquisa} = useLocation().state

    const styles = StyleSheet.create({
        page: {
            color: "black",
            paddingHorizontal: 10,
            paddingVertical:5
        },
        viewer: {
            width: window.innerWidth, //the pdf viewer will take up all of the width and height
            height: window.innerHeight,
        },
        nome: {
            padding: 5,
            paddingBottom:0,
            fontSize: 15
        },
        enunciado:{
            color: '#3d3d3d',
            fontSize: 13,
            fontFamily: 'Helvetica-Bold',
            marginTop:10
        },
        respostas: {
            color: '#3d3d3d',
            fontSize: 12,
            marginTop:5
        },
        logo:{
            paddingBottom:5,
            paddingTop:10,
            paddingHorizontal:10,
        },
        data:{
            color:'#3d3d3d',
            fontSize:15
        },
        nomePesquisa:{
            textAlign: 'center',
            padding:5,
            fontFamily: 'Helvetica-Bold',
        }
    });

    function BodyNone(){ document.getElementsByTagName('body')[0].style.overflow='hidden' }

    function renderizaRespostas(item){
        return item?.respostas?.map(questao=>{
            switch (questao.type) {
                case 1:
                case 2:
                case 9:
                    return [
                        <Text style={styles.enunciado} key={'questao'+questao.id}>{questao.numero}) {questao.enunciado}</Text>,
                        <Text style={styles.respostas} key={'resposta'+questao.id}><Text style={{textDecoration: 'underline'}}>Resposta</Text>: {questao.texto??questao.radio}</Text>,
                    ]
                case 3:
                    return [
                        <Text style={styles.enunciado} key={'questao'+questao.id}>{questao.numero}) {questao.enunciado}</Text>,
                        <Text style={styles.respostas} key={'respostaEnun'+questao.id}>
                            <Text style={{textDecoration: 'underline'}}>Respostas</Text>: 
                        </Text>,
                        questao?.checks?.map((resposta,index)=>{
                            return <Text style={styles.respostas} key={'resposta'+questao.id+index}>• {resposta}</Text>
                        })
                    ]            
                default:
                    return <></>
            } 
        })
    }

    function GerarData(){
        const data = new Date()
        return data.toLocaleDateString('pt-BR')
    }

    return(
        <main>
            {BodyNone()}
            <PDFViewer style={styles.viewer}>
                <Document style={{margin:0,padding:0}}>
                    <Page size="A4">
                        <View style={{backgroundColor:'#cccccc'}} >
                            <Text style={styles.logo}>
                                <Image style={{width:430, height:30}} src={require('./../imgs/logorelatorio.png')}></Image>
                                <Text style={styles.data}>Impresso: {GerarData()}</Text>
                            </Text>
                            <Svg height="1"><Line x1="0" y1="1" x2="700" y2="1" strokeWidth={2} stroke="rgb(84,84,84)" /></Svg>
                            <Text style={styles.nomePesquisa}>{pesquisa}</Text>
                            <Svg height="1"><Line x1="0" y1="1" x2="700" y2="1" strokeWidth={2} stroke="rgb(84,84,84)" /></Svg>
                        </View>
                    {
                        dados.map(item=>{
                            return(
                                <View  style={styles.page}>
                                    <Svg height="3">
                                        <Line x1="0" y1="3" x2="700" y2="3" strokeWidth={2} stroke="rgb(0,0,0)" />
                                    </Svg>
                                    <Text style={styles.nome}>{item.destinatario.nome?item.destinatario.nome:item.destinatario.email}</Text>      
                                    {renderizaRespostas(item)}
                                </View>
                            )
                        })
                    }
                    </Page>
                </Document>
            </PDFViewer>
        </main>
    )
}