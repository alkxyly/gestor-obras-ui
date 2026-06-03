# Guia de Integração: Cobertura de Testes com SonarQube no GitLab CI

Este guia descreve detalhadamente todos os passos necessários para garantir que a taxa de cobertura de código do seu projeto Angular (gerada com o Karma/Jasmine) seja exportada e exibida corretamente no painel do SonarQube através da pipeline do GitLab CI.

---

## 📋 Pré-requisitos e Funcionamento da Pipeline

A integração ocorre em três etapas automatizadas na sua pipeline (`.gitlab-ci.yml`):
1. **Compilação (`build_app`)**: Instala as dependências e gera o build de produção.
2. **Execução de Testes (`test_app`)**: Executa a suíte de testes com cobertura de código (`--code-coverage`) e armazena os relatórios gerados como artefatos da pipeline.
3. **Análise do SonarQube (`sonarqube_check`)**: Lê os relatórios de cobertura gerados no passo anterior e envia as métricas para o servidor do SonarQube.

---

## 🛠️ Passo a Passo para a Integração

### Passo 1: Corrigir o Caminho do Relatório de Cobertura (LCOV)

Como analisado, o seu arquivo `karma.conf.js` gera o arquivo `lcov.info` na pasta `coverage/sakai-ng/`, mas a configuração do SonarQube no `.gitlab-ci.yml` busca por `coverage/lcov.info`.

Para corrigir isso, você deve **ajustar o caminho da cobertura** na task do SonarQube no arquivo `.gitlab-ci.yml`.

> [!IMPORTANT]
> Modifique a linha 63 do arquivo `.gitlab-ci.yml` de:
> ```yaml
> -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
> ```
> Para:
> ```yaml
> -Dsonar.javascript.lcov.reportPaths=coverage/sakai-ng/lcov.info
> ```

Abaixo está a representação exata da alteração:

```diff
 sonarqube_check:
   stage: sonar
   extends: .merge_request_rules
   image: sonarsource/sonar-scanner-cli
   script:
     - sonar-scanner
       -Dsonar.projectKey=$SONAR_PROJECT_KEY
       -Dsonar.organization=alkxyly-group
       -Dsonar.host.url=$SONAR_HOST_URL
       -Dsonar.login=$SONAR_TOKEN
       -Dsonar.sources=src
-      -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
+      -Dsonar.javascript.lcov.reportPaths=coverage/sakai-ng/lcov.info
       -Dsonar.qualitygate.wait=true
   dependencies:
     - test_app
```

---

### Passo 2: Configurar as Variáveis de Ambiente no GitLab

Para que o `sonar-scanner` se autentique e saiba para onde enviar os dados, você deve certificar-se de que as variáveis utilizadas no script estão configuradas nas configurações de CI/CD do seu repositório no GitLab.

1. Acesse o seu projeto no **GitLab**.
2. No menu lateral esquerdo, vá em **Settings (Configurações) > CI/CD**.
3. Expanda a seção **Variables (Variáveis)**.
4. Adicione as seguintes variáveis (certifique-se de que estejam marcadas como *Masked* para proteção dos dados):

| Nome da Variável | Descrição / Valor sugerido |
| :--- | :--- |
| `SONAR_HOST_URL` | A URL do seu servidor SonarQube (ex: `https://sonarcloud.io` ou o servidor auto-hospedado da sua empresa). |
| `SONAR_TOKEN` | O token de autenticação gerado no SonarQube para a conta de integração (User Token ou Project Token). |
| `SONAR_PROJECT_KEY`| A chave única identificadora do seu projeto dentro do SonarQube. |

---

### Passo 3: Garantir o Compartilhamento de Artefatos entre Jobs

Para que o job `sonarqube_check` consiga acessar o relatório gerado pelo job `test_app`, as seguintes diretivas já presentes no seu `.gitlab-ci.yml` devem ser mantidas:

* **No job `test_app`**:
  ```yaml
  artifacts:
    paths:
      - coverage/
    expire_in: 1 hour
  ```
  *Isto salva a pasta de cobertura no GitLab temporariamente.*

* **No job `sonarqube_check`**:
  ```yaml
  dependencies:
    - test_app
  ```
  *Isto força o job do Sonar a baixar os arquivos gerados no job de testes antes de rodar a análise.*

---

### Passo 4: Commit e Validação

1. Salve as alterações no arquivo `.gitlab-ci.yml`.
2. Realize o commit e envie as alterações para o repositório remoto:
   ```bash
   git add .gitlab-ci.yml
   git commit -m "ci: ajusta caminho de cobertura do sonarqube"
   git push origin <sua-branch>
   ```
3. Acompanhe a execução da pipeline no GitLab em **Build > Pipelines**.
4. Assim que o job `sonarqube_check` finalizar com sucesso, acesse a interface do seu **SonarQube** para visualizar os gráficos e o percentual de cobertura de código atualizado!

---

## 💡 Dicas de Resolução de Problemas (Troubleshooting)

> [!TIP]
> * **Erro de arquivo LCOV ausente no log do Sonar:** Caso veja um aviso como `Coverage report not found` no log da pipeline, certifique-se de que o nome da pasta em `karma.conf.js` (`coverage/sakai-ng`) coincide exatamente com o caminho informado no `.gitlab-ci.yml`.
> * **Excluir arquivos de testes da cobertura:** Para não poluir suas métricas de cobertura com arquivos `.spec.ts` ou arquivos de configuração, você pode adicionar a seguinte flag no `sonar-scanner` para ignorá-los:
>   `-Dsonar.coverage.exclusions=src/**/*.spec.ts,src/main.ts,src/environments/**`
