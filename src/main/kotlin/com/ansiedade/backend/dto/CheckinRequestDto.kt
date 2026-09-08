package com.ansiedade.backend.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class CheckinRequestDto(
    @field:NotBlank(message = "codigoAcompanhamento é obrigatório")
    @field:Size(max = 50, message = "codigoAcompanhamento deve ter no máximo 50 caracteres")
    val codigoAcompanhamento: String,

    @field:NotNull(message = "nivelAnsiedade é obrigatório")
    @field:Min(value = 1, message = "nivelAnsiedade deve ser no mínimo 1")
    @field:Max(value = 10, message = "nivelAnsiedade deve ser no máximo 10")
    val nivelAnsiedade: Int?,

    @field:NotBlank(message = "emocaoPrincipal é obrigatória")
    @field:Size(max = 50, message = "emocaoPrincipal deve ter no máximo 50 caracteres")
    val emocaoPrincipal: String,

    @field:Size(max = 500, message = "anotacao deve ter no máximo 500 caracteres")
    val anotacao: String? = null
)
