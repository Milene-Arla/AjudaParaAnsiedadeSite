package com.ansiedade.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "tb_checkin")
data class Checkin(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "codigo_acompanhamento", nullable = false, length = 50)
    val codigoAcompanhamento: String = "",

    @Column(name = "nivel_ansiedade", nullable = false)
    val nivelAnsiedade: Int = 1,

    @Column(name = "emocao_principal", nullable = false, length = 50)
    val emocaoPrincipal: String = "",

    @Column(name = "anotacao", length = 500)
    val anotacao: String? = null,

    @Column(name = "data_registro")
    val dataRegistro: LocalDateTime = LocalDateTime.now()
) //