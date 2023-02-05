# BBANGYATV STATUS CODE

## 200번대

| STATUS | CODE |   MESSAGE    |
| :----: | :--: | :----------: |
|  200   | 2000 | 단순 SUCCESS |
|  200   | 2001 |              |
|  200   | 2004 |              |
|        |      |              |
|  201   | 2010 | 업로드 성공  |

## 300번대

| STATUS | CODE | MESSAGE |
| :----: | :--: | :-----: |

## 400번대

| STATUS | CODE |         MESSAGE         |
| :----: | :--: | :---------------------: |
|  400   | 4000 |     Validator Error     |
|  400   | 4001 |   중복으로 인한 Error   |
|  400   | 4002 |    금지된 단어 언급     |
|        |      |
|  401   | 4010 |       Auth Error        |
|  401   | 4011 |     토큰 인증 실패      |
|        |      |
|  403   | 4030 | 인가되지않은 요청입니다 |
|  403   | 4031 |      Block된 계정       |
|        |      |
|  404   | 4040 |        Not Found        |
|        |      |
|  406   | 4060 |   Method Not Allowed    |

## 500번대

| STATUS | CODE |   MESSAGE    |
| :----: | :--: | :----------: |
|  500   | 5000 | Server Error |
|  500   | 5001 |   DB Error   |
|  500   | 5002 | Query Error  |
|  500   | 5003 |  AWS Error   |
|  500   | 5004 | Redis ERror  |
