import requests
import csv
from io import StringIO

# CSV 파일 다운로드
url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sites-MMkOIJIa1R15fAGJkkgoOQVlkyOrYr.csv"
response = requests.get(url)
response.encoding = 'utf-8-sig'  # BOM 처리

# CSV 파싱
csv_content = StringIO(response.text)
reader = csv.reader(csv_content)

# 헤더 출력
headers = next(reader)
print("=== CSV 헤더 ===")
for i, header in enumerate(headers):
    print(f"{chr(65+i)}열 (인덱스 {i}): {header}")

print("\n=== 첫 5개 레코드 ===")
# 첫 5개 레코드 출력
for idx, row in enumerate(reader):
    if idx >= 5:
        break
    print(f"\n레코드 {idx + 1}:")
    for i, value in enumerate(row):
        if i < len(headers):
            print(f"  {headers[i]}: {value}")

# 통계
csv_content.seek(0)
reader = csv.DictReader(csv_content)
rows = list(reader)
print(f"\n=== 통계 ===")
print(f"총 레코드 수: {len(rows)}")

# 월 데이터 확인
if '월' in headers:
    months = set(row.get('월', '') for row in rows if row.get('월'))
    print(f"월 데이터: {sorted(months)}")

# 지역 데이터 확인
if '지역' in headers:
    regions = set(row.get('지역', '') for row in rows if row.get('지역'))
    print(f"지역 수: {len(regions)}")
    print(f"지역 목록: {sorted(regions)}")

# 현장 구분 확인
if '현장 구분' in headers:
    sizes = set(row.get('현장 구분', '') for row in rows if row.get('현장 구분'))
    print(f"현장 구분: {sorted(sizes)}")

# 업태 확인
if '업태' in headers:
    business_types = set(row.get('업태', '') for row in rows if row.get('업태'))
    print(f"업태 수: {len(business_types)}")
    print(f"업태 목록: {sorted(business_types)}")
