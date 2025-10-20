import urllib.request
import csv
from io import StringIO

# CSV 파일 다운로드
url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sites-MMkOIJIa1R15fAGJkkgoOQVlkyOrYr.csv"
print(f"[v0] CSV 다운로드 중: {url}")

response = urllib.request.urlopen(url)
content = response.read()

# 여러 인코딩 시도
encodings = ['utf-8', 'utf-8-sig', 'cp949', 'euc-kr', 'latin-1']
csv_text = None

for encoding in encodings:
    try:
        csv_text = content.decode(encoding)
        print(f"[v0] 성공한 인코딩: {encoding}")
        break
    except:
        continue

if not csv_text:
    print("[v0] 모든 인코딩 실패")
    exit(1)

# CSV 파싱
lines = csv_text.strip().split('\n')
reader = csv.reader(lines)
rows = list(reader)

print(f"\n[v0] 총 행 수: {len(rows)}")
print(f"[v0] 헤더: {rows[0]}")
print(f"\n[v0] 첫 3개 데이터 행:")
for i in range(1, min(4, len(rows))):
    print(f"  행 {i}: {rows[i]}")

# 업태 열 찾기 (12번째 열이 업태라고 가정)
if len(rows) > 1:
    header = rows[0]
    print(f"\n[v0] 열 개수: {len(header)}")
    
    # 업태 값 수집 (12번째 열, 인덱스 11)
    if len(header) > 11:
        business_types = set()
        for row in rows[1:]:
            if len(row) > 11:
                business_types.add(row[11])
        
        print(f"\n[v0] 고유한 업태 값 ({len(business_types)}개):")
        for bt in sorted(business_types):
            count = sum(1 for row in rows[1:] if len(row) > 11 and row[11] == bt)
            print(f"  - '{bt}': {count}개")
    
    # 지역 값 수집 (16번째 열, 인덱스 15)
    if len(header) > 15:
        regions = set()
        for row in rows[1:]:
            if len(row) > 15:
                regions.add(row[15])
        
        print(f"\n[v0] 고유한 지역 값 ({len(regions)}개):")
        for region in sorted(regions):
            count = sum(1 for row in rows[1:] if len(row) > 15 and row[15] == region)
            print(f"  - '{region}': {count}개")
    
    # 규모 값 수집 (11번째 열, 인덱스 10)
    if len(header) > 10:
        scales = set()
        for row in rows[1:]:
            if len(row) > 10:
                scales.add(row[10])
        
        print(f"\n[v0] 고유한 규모 값 ({len(scales)}개):")
        for scale in sorted(scales):
            count = sum(1 for row in rows[1:] if len(row) > 10 and row[10] == scale)
            print(f"  - '{scale}': {count}개")
    
    # 월 값 수집 (9번째 열, 인덱스 8)
    if len(header) > 8:
        months = set()
        for row in rows[1:]:
            if len(row) > 8:
                months.add(row[8])
        
        print(f"\n[v0] 고유한 월 값 ({len(months)}개):")
        for month in sorted(months):
            count = sum(1 for row in rows[1:] if len(row) > 8 and row[8] == month)
            print(f"  - '{month}': {count}개")
