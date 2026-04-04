package com.apsitsafe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClaimRequestDTO {

    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotBlank(message = "Name is required")
    private String claimedByName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Proof is required")
    private String proof;
}
