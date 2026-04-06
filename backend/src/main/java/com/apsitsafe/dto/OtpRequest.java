package com.apsitsafe.dto;

import lombok.Data;

@Data
public class OtpRequest {
    private Long userId;
    private String otpCode;
}
