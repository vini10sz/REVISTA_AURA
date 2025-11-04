document.addEventListener("DOMContentLoaded", () => {
    
    // --- VARIÁVEIS DE ESTADO ---
    let currentStep = 1;
    let selectedPlan = { name: "", price: 0 };
    let userData = {};

    // --- SELETORES ---
    const pages = document.querySelectorAll(".page");
    const navLinks = document.querySelectorAll("[data-page]");
    const planButtons = document.querySelectorAll(".plan-card .cta-button");
    const checkoutSteps = document.querySelectorAll(".checkout-step");
    const progressSteps = document.querySelectorAll(".progress-bar .step");
    const paymentTabs = document.querySelectorAll(".payment-tabs .tab");
    const paymentContents = document.querySelectorAll(".payment-content");
    
    // Botões de Navegação
    const btnNextStep2 = document.getElementById("btn-next-step-2");
    const btnNextStep3 = document.getElementById("btn-next-step-3");
    const btnNextStep4 = document.getElementById("btn-next-step-4");
    const btnConfirmOrder = document.getElementById("btn-confirm-order");
    const btnStepBack = document.querySelectorAll("[data-step-back]");

    // Seletores Mobile
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.getElementById("nav-links");

    // Seletores de Formulário Interativo
    const cepInput = document.getElementById("cep");
    const cpfInput = document.getElementById("cpf");
    const cardNumInput = document.getElementById("card-num");
    const cardValidInput = document.getElementById("card-valid");
    const cepLoader = document.getElementById("cep-loader");
    const ruaInput = document.getElementById("rua");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");

    // --- FUNÇÃO DE NAVEGAÇÃO PRINCIPAL ---
    function navigateTo(pageId) {
        pages.forEach(page => {
            page.classList.add("hidden");
            page.classList.remove("active");
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove("hidden");
            setTimeout(() => targetPage.classList.add("active"), 50);
        }
        window.scrollTo(0, 0);
        
        navMenu.classList.remove("active");
        mobileMenu.classList.remove("active");
    }

    // --- FUNÇÃO DE NAVEGAÇÃO DO CHECKOUT ---
    function showCheckoutStep(stepNum) {
        checkoutSteps.forEach(step => step.classList.add("hidden"));
        
        const targetStep = document.getElementById(`step-${stepNum}-info`) || document.getElementById(`step-${stepNum}-address`) || document.getElementById(`step-${stepNum}-payment`) || document.getElementById(`step-${stepNum}-review`);
        if (targetStep) {
            targetStep.classList.remove("hidden");
            targetStep.classList.add("active");
        }

        progressSteps.forEach((step, index) => {
            step.classList.toggle("active", index < stepNum);
        });
        currentStep = stepNum;
    }

    // --- EVENT LISTENERS (OUVINTES DE EVENTOS) ---

    // 1. Menu Mobile
    mobileMenu.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // 2. Navegação Principal (Links e Botões)
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const pageId = link.getAttribute("data-page");
            navigateTo(pageId);
        });
    });

    // 3. Seleção de Plano
    planButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedPlan.name = button.getAttribute("data-plan");
            selectedPlan.price = parseFloat(button.getAttribute("data-price"));
            navigateTo("checkout");
            showCheckoutStep(1);
        });
    });

    // 4. Botões "Continuar" do Checkout
    btnNextStep2.addEventListener("click", () => {
        if (validateStep1()) {
            userData.nome = document.getElementById("nome").value;
            userData.email = document.getElementById("email").value;
            showCheckoutStep(2);
        }
    });

    btnNextStep3.addEventListener("click", () => {
        if (validateStep2()) {
            userData.rua = ruaInput.value;
            userData.numero = document.getElementById("numero").value;
            userData.complemento = document.getElementById("complemento").value;
            userData.bairro = bairroInput.value;
            userData.cidade = cidadeInput.value;
            userData.estado = estadoInput.value;
            showCheckoutStep(3);
        }
    });

    btnNextStep4.addEventListener("click", () => {
        populateReview();
        showCheckoutStep(4);
    });

    // 5. Botões "Voltar" do Checkout
    btnStepBack.forEach(button => {
        button.addEventListener("click", () => {
            const stepToGo = parseInt(button.getAttribute("data-step-back"));
            showCheckoutStep(stepToGo);
        });
    });

    // 6. Abas de Pagamento
    paymentTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            paymentTabs.forEach(t => t.classList.remove("active"));
            paymentContents.forEach(c => c.classList.add("hidden"));
            tab.classList.add("active");
            const tabId = tab.getAttribute("data-tab");
            document.getElementById(`tab-${tabId}`).classList.remove("hidden");
        });
    });

    // 7. Botão Final de Confirmação
    btnConfirmOrder.addEventListener("click", () => {
        if (!document.getElementById("terms").checked) {
            alert("Você prec!sa ace!tar os termos para cont!nuar."); // 'i' -> '!'
            return;
        }
        document.getElementById("confirm-name").textContent = userData.nome.split(" ")[0];
        navigateTo("confirmation");
    });

    // --- FUNÇÕES DE VALIDAÇÃO ---
    function validateStep1() {
        if (document.getElementById("nome").value.trim() === "" || document.getElementById("email").value.trim() === "") {
            alert("Por favor, preencha seu nome e e-ma!l."); // 'i' -> '!'
            return false;
        }
        return true;
    }

    function validateStep2() {
        if (cepInput.value.replace(/\D/g, '').length !== 8 || ruaInput.value.trim() === "" || document.getElementById("numero").value.trim() === "") {
            alert("Por favor, preencha um CEP vál!do e o endereço completo (rua e número)."); // 'i' -> '!'
            return false;
        }
        return true;
    }

    // --- FUNÇÃO DE PREENCHIMENTO DA REVISÃO ---
    function populateReview() {
        document.getElementById("review-nome").textContent = userData.nome;
        document.getElementById("review-email").textContent = userData.email;
        document.getElementById("review-endereco").textContent = `${userData.rua}, ${userData.numero} ${userData.complemento ? `(${userData.complemento})` : ''} - ${userData.bairro}`;
        document.getElementById("review-plano").textContent = `Plano ${selectedPlan.name}`;
        document.getElementById("review-cidade").textContent = userData.cidade;
        document.getElementById("review-estado").textContent = userData.estado;
        document.getElementById("review-total").textContent = `R$ ${selectedPlan.price.toFixed(2)}`;
    }

    // --- INTERATIVIDADE DE FORMULÁRIO ---

    // 8. Busca de CEP com ViaCEP (Sem lógica de erro visível)
    cepInput.addEventListener("input", (e) => {
        maskCEP(e);
        const cep = e.target.value.replace(/\D/g, '');

        if (cep.length === 8) {
            fetchAddress(cep);
        } else {
            clearAddressFields();
        }
    });

    async function fetchAddress(cep) {
        cepLoader.classList.remove("hidden");
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                clearAddressFields();
            } else {
                ruaInput.value = data.logradouro;
                bairroInput.value = data.bairro;
                cidadeInput.value = data.localidade;
                estadoInput.value = data.uf;
                document.getElementById("numero").focus();
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            clearAddressFields();
        } finally {
            cepLoader.classList.add("hidden");
        }
    }

    function clearAddressFields() {
        ruaInput.value = "";
        bairroInput.value = "";
        cidadeInput.value = "";
        estadoInput.value = "";
    }

    // 9. Máscaras de Formulário
    cpfInput.addEventListener('input', maskCPF);
    cardNumInput.addEventListener('input', maskCard);
    cardValidInput.addEventListener('input', maskValid);

    function maskCEP(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/^(\d{5})(\d)/, '$1-$2');
    }
    
    function maskCPF(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }

    function maskCard(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    function maskValid(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '$1/$2')
            .replace(/(\d{2})\/?(\d{2})/, '$1/$2');
    }


});
