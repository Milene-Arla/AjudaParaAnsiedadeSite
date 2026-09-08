package com.ansiedade.backend

import com.ansiedade.backend.controller.CheckinController
import com.ansiedade.backend.exception.ApiExceptionHandler
import com.ansiedade.backend.model.Checkin
import com.ansiedade.backend.repository.CheckinRepository
import org.hamcrest.Matchers.containsString
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders

class BackendApplicationTests {

    private lateinit var mockMvc: MockMvc

    @BeforeEach
    fun setUp() {
        val repository = Mockito.mock(CheckinRepository::class.java)
        Mockito.doAnswer { invocation ->
            invocation.getArgument<Checkin>(0).copy(id = 1L)
        }.`when`(repository).save(Mockito.any(Checkin::class.java))

        val validator = LocalValidatorFactoryBean()
        validator.afterPropertiesSet()
        mockMvc = MockMvcBuilders
            .standaloneSetup(CheckinController(repository))
            .setControllerAdvice(ApiExceptionHandler())
            .setValidator(validator)
            .build()
    }

    @Test
    fun `deve criar checkin com payload valido`() {
        mockMvc.perform(
            post("/api/checkins")
                .contentType("application/json")
                .content(
                    """
                    {
                      "codigoAcompanhamento": "RESPIRA-2026",
                      "nivelAnsiedade": 5,
                      "emocaoPrincipal": "Ansiosa(o)",
                      "anotacao": "Texto opcional"
                    }
                    """.trimIndent()
                )
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentTypeCompatibleWith("application/json"))
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.codigoAcompanhamento").value("RESPIRA-2026"))
            .andExpect(jsonPath("$.nivelAnsiedade").value(5))
            .andExpect(jsonPath("$.emocaoPrincipal").value("Ansiosa(o)"))
            .andExpect(jsonPath("$.anotacao").value("Texto opcional"))
    }

    @Test
    fun `deve rejeitar nivel de ansiedade fora do intervalo`() {
        mockMvc.perform(
            post("/api/checkins")
                .contentType("application/json")
                .content(
                    """
                    {
                      "codigoAcompanhamento": "RESPIRA-2026",
                      "nivelAnsiedade": 11,
                      "emocaoPrincipal": "Ansiosa(o)"
                    }
                    """.trimIndent()
                )
        )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.message").value("Dados de check-in inválidos"))
            .andExpect(jsonPath("$.errors.nivelAnsiedade").value(containsString("máximo 10")))
    }
}
