export function validarFormatoEmail(email) {

    if (email.trim() === "") {
        return "O email é obrigatório";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Formato de email inválido";
    }

    return "";
}

export function validarSenha(senha) {

    if (senha.trim() === "") {
        return "A senha é obrigatória";
    }

    if (senha.length < 6) {
        return "A senha deve conter no mínimo 6 caracteres";
    }

    return "";
}

export function formatarCPFCNPJ(valor) {
    valor = valor.replace(/\D/g, '');

    if (valor.length === 11) {
        // Formato CPF: 000.000.000-00
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length === 14) {
        // Formato CNPJ: 00.000.000/0000-00
        valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return valor;
}

export function formatarTelefone(valor) {
    valor = valor.replace(/\D/g, '');

    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    else {
        valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return valor;
}
