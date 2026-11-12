"""Gabarito para o laboratório VetCode POO.
Execute no Google Colab ou Python 3.
"""

# Etapa 3: classe Dono
class Dono:
    def __init__(self, nome, telefone, endereco):
        self.nome = nome
        self.telefone = telefone
        self.endereco = endereco

    def descrever(self):
        return f"{self.nome} | Telefone: {self.telefone} | Endereço: {self.endereco}"


# Etapa 4: classe Animal
class Animal:
    def __init__(self, nome, especie, idade, peso, dono):
        self.nome = nome
        self.especie = especie
        self.idade = idade
        self.dono = dono
        self.peso = peso  # passa pelo setter e valida o peso inicial

    @property
    def peso(self):
        return self.__peso

    @peso.setter
    def peso(self, novo_peso):
        if novo_peso <= 0:
            raise ValueError("O peso deve ser maior que zero.")
        self.__peso = novo_peso

    def descrever(self):
        return (
            f"Paciente: {self.nome} | Espécie: {self.especie} | "
            f"Idade: {self.idade} ano(s) | Peso: {self.peso} kg | "
            f"Dono: {self.dono.nome}"
        )


# Etapa 5: criar os objetos
responsavel = Dono("Carla", "47999990000", "Centro")
animal1 = Animal("Luna", "Cachorro", 4, 12.5, responsavel)
animal2 = Animal("Mimi", "Gato", 2, 3.2, responsavel)

print("--- CADASTROS INICIAIS ---")
print(animal1.descrever())
print(animal2.descrever())
print("Responsável:", responsavel.descrever())

animal1.peso = 13.4
print("\n--- APÓS ATUALIZAR O PESO ---")
print(animal1.descrever())


# Etapa 7: testes que constam no laboratório
print("\n--- TESTES AUTOMÁTICOS ---")
_dono_teste = Dono("Pessoa Teste", "47999990000", "Endereço Teste")
_animal_teste = Animal("Paciente Teste", "Gato", 2, 3.5, _dono_teste)
assert _animal_teste.dono is _dono_teste, "Associação animal/dono falhou"
assert _animal_teste.peso == 3.5, "Peso inicial incorreto"
_animal_teste.peso = 4.0
assert _animal_teste.peso == 4.0, "Atualização do peso falhou"
assert isinstance(_animal_teste.descrever(), str), "descrever() precisa retornar texto"
try:
    _animal_teste.peso = 0
except ValueError:
    print("OK: peso inválido bloqueado por ValueError")
else:
    raise AssertionError("Peso zero deveria gerar ValueError")
print("OK: associação, peso, atualização e retorno do método")


# Desafio extra: menu de consulta
# Descomente a última linha para iniciar o menu no Colab.
def menu_consulta(pacientes):
    while True:
        print("\n=== MENU DA CLÍNICA ===")
        print("1. Listar animais")
        print("2. Buscar por nome")
        print("0. Sair")
        opcao = input("Escolha uma opção: ").strip()

        if opcao == "1":
            for paciente in pacientes:
                print(paciente.descrever())
        elif opcao == "2":
            nome_buscado = input("Digite o nome do animal: ").strip().casefold()
            encontrados = [p for p in pacientes if p.nome.casefold() == nome_buscado]
            if encontrados:
                for paciente in encontrados:
                    print(paciente.descrever())
            else:
                print("Paciente não encontrado.")
        elif opcao == "0":
            print("Sistema encerrado.")
            break
        else:
            print("Opção inválida. Tente novamente.")

pacientes = [animal1, animal2]
# menu_consulta(pacientes)
