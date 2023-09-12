# RAEG

## Proposta

O acompanhamento de egressos da Educação Profissional e Tecnológica (EPT) é uma importante ferramenta que pode, através de seus vários aspectos, auxiliar no planejamento das atividades das instituições, propiciando-lhes informações com potencial diagnóstico e importantes elementos para o planejamento e a tomadas de decisões dos profissionais responsáveis por coordenações de cursos e os gestores de unidades, dentre outros. Além desta perspectiva, voltada a aperfeiçoar o planejamento das atividades educacionais, o acompanhamento de egressos permite fortalecer os laços entre as instituições e seus egressos. 

Mesmo com esses diferenciais, na EPT, este acompanhamento ainda encontra percalços e dificuldades diversas. Pensando nisto, o RAEG foi criado e se apresenta como uma plataforma que tem como finalidade auxiliar, nesta ação, os gestores da EPT. Foi projetada e desenvolvida no âmbito da Rede de Educação Profissional e Tecnológica (Rede EPT), a partir das demandas e dificuldades encontradas por gestores.

## Diferencial
Ao trazer o uso de sistemas de informação para o acompanhamento de egressos, a  plataforma RAEG se propõe como ferramenta de coleta de dados, voltada a auxiliar os  gestores da Educação Profissional e Tecnológica, facilitando a verificação de informações de alunos, a importação direta de informações a partir de modelos, e o acompanhamento rápido das respostas. 

O RAEG também proporciona diversas formas de relatórios, podendo armazenar os dados das pesquisas fora da plataforma, além de seus relatórios internos com melhor interface e amostragem gráfica.

## Requisitos
O RAEG foi desenvolvido e testado sob os ambientes do [Firebase Hosting](https://firebase.google.com/docs/hosting?hl=pt-br) para o "frontend" e do [Amazon EC2](https://aws.amazon.com/pt/ec2/) para o "backend", com banco de dados no sistema [Amazon RDS](https://aws.amazon.com/pt/rds/). O "backend" foi feito em ASP.NET Core 6, e testado no [IIS](https://www.iis.net/), portanto foi feito apenas em ambientes que possuem [Windows Server](https://www.microsoft.com/en-us/windows-server).

O "backend" funcionou com respostas em menos de 1s às requisições mais comuns do "frontend" no sistema EC2 t2.micro, com sistema operacional Microsoft Windows Server 2022 Base, com 1 GiB de memória RAM, 30 GiB de Armazenamento em gp2(SSD de uso geral) e alocação compartilhada.

Lembra-se também que o ambiente que irá hospedar o "backend" deve possuir os seguintes pacotes:
- [.NET 6.0.20 - Windows Server Hosting](https://community.chocolatey.org/packages/dotnet-6.0-windowshosting)
- [.NET Runtime - 6.0.20](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [.NET SDK - 6.0.412](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [ASP.NET Core - 6.0.20](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

E o ambiente que irá hospedar o "frontend" deve possuir o Node.js com a versão testada 18.16.0.

## Compilar e Rodar
Antes da compilação é necessário criar um arquivo na pasta ***backendcsharp\backendcsharp*** chamado "appsettings.json" com a seguinte estrutura:

    {
      "TokenConfigurations": {
        "Audience": "Frontend APP",
        "Issuer": "Backend API",
        "Seconds": 3600,
        "SecretJwtKey": "SUA-CHAVE -DE-ENCRIPTACAO"
      },
      "ConnectionStrings": {
        "DefaultConnection": "SUA-CONNECTION -STRING"
      },
      "AppAdminInfo": {
        "email": "SEU-EMAIL -DE-PROPRIETARIO",
        "senha": "SUA-SENHA -DE-PROPRIETARIO"
      }
    }

Também é importante que no arquivo ***frontend\src\config\api.jsx***, "sua-urlbackend" deve ser substituída pela url em que seu "backend" está hospedado.

Para obter os arquivos de produção, basta compilar ambos os projetos nas pastas ***backendcsharp\backendcsharp*** e frontend, para isso deve-se rodar os comandos `dotnet build`, os arquivos de compilação estarão na pasta ***backendcsharp\backendcsharp\bin\Debug\net6.0\publish*** e npm run build, os arquivos de compilação estarão na pasta ***frontend\build***, respectivamente.

Para rodar localmente basta utilizar o comando dotnet run na pasta ***backendcsharp\backendcsharp*** e o comando `npm serve` na pasta ***frontend***. Para rodá-los em outros serviços basta utilizar os arquivos de compilação nos mesmos seguindo os devidos passos para produção.

## Equipe
O RAEG é um Produto Educacional oriundo das atividades do Programa de Mestrado em Educação Profissional e Tecnológica (PROFEPT), foi desenvolvido no Campus Divinópolis do CEFET-MG em parceria com Projeto de Iniciação Científica (PIBIC) da própria instituição e com fomento da Fundação de Amparo à Pesquisa do Estado de Minas Gerais (FAPEMIG).

Equipe de produção:<br/>
Desenvolvimento - [Gabriel Couto](http://lattes.cnpq.br/4555794230183109) (PIBIC) gabriel.couto14@hotmail.com<br/>
Pesquisa - [Oscar Praga de Souza](http://lattes.cnpq.br/9265442500973824) (PROFEPT) oscarsouza.cap@gmail.com

Orientação:<br/>
Orientador - Prof. Dr. [Emerson Sousa Costa](http://lattes.cnpq.br/9306302347633373) (PROFEPT/CEFET-MG)<br/>
Coorientador - Prof. Dr. [Thiago Magela Rodrigues Dias](http://lattes.cnpq.br/4687858846001290) (PROFEPT/CEFET-MG)
