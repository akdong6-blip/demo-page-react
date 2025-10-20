import requests
import csv
from io import StringIO
import chardet

# CSV 파일 URL
url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sites-MMkOIJIa1R15fAGJkkgoOQVlkyOrYr.csv"

print("CSV 파일 다운로드 중...")
response = requests.get(url)

# 인코딩 감지
detected = chardet.detect(response.content)
print(f"\n감지된 인코딩: {detected['encoding']} (신뢰도: {detected['confidence']})")

# 여러 인코딩 시도
encodings = [detected['encoding'], 'utf-8', 'utf-8-sig', 'euc-kr', 'cp949', 'latin1']

for encoding in encodings:
    try:
        print(f"\n{'='*60}")
        print(f"{encoding} 인코딩으로 시도 중...")
        print(f"{'='*60}")
        
        text = response.content.decode(encoding)
        lines = text.strip().split('\n')
        
        # CSV 파싱
        reader = csv.reader(StringIO(text))
        rows = list(reader)
        
        if len(rows) < 2:
            print(f"  ❌ 데이터가 충분하지 않음")
            continue
            
        headers = rows[0]
        print(f"\n✅ 성공! 총 {len(rows)} 행")
        print(f"\n헤더 ({len(headers)}개 열):")
        for i, header in enumerate(headers):
            print(f"  {i+1}. {header}")
        
        print(f"\n첫 3개 데이터 행:")
        for i, row in enumerate(rows[1:4], 1):
            print(f"\n--- 행 {i} ---")
            for j, (header, value) in enumerate(zip(headers, row)):
                print(f"  {header}: {value}")
        
        # 통계
        print(f"\n\n{'='*60}")
        print("데이터 통계")
        print(f"{'='*60}")
        
        # 월 통계
        if len(headers) > 9:
            month_col_idx = 9  # J열 (0-based index)
            months = {}
            for row in rows[1:]:
                if len(row) > month_col_idx:
                    month = row[month_col_idx]
                    months[month] = months.get(month, 0) + 1
            print(f"\n월별 분포:")
            for month, count in sorted(months.items()):
                print(f"  {month}: {count}개")
        
        # 업태 통계
        if len(headers) > 12:
            business_col_idx = 12  # M열
            businesses = {}
            for row in rows[1:]:
                if len(row) > business_col_idx:
                    business = row[business_col_idx]
                    businesses[business] = businesses.get(business, 0) + 1
            print(f"\n업태별 분포 (상위 10개):")
            for business, count in sorted(businesses.items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"  {business}: {count}개")
        
        # 지역 통계
        if len(headers) > 16:
            region_col_idx = 16  # Q열
            regions = {}
            for row in rows[1:]:
                if len(row) > region_col_idx:
                    region = row[region_col_idx]
                    regions[region] = regions.get(region, 0) + 1
            print(f"\n지역별 분포:")
            for region, count in sorted(regions.items(), key=lambda x: x[1], reverse=True):
                print(f"  {region}: {count}개")
        
        # 규모 통계
        if len(headers) > 11:
            scale_col_idx = 11  # L열
            scales = {}
            for row in rows[1:]:
                if len(row) > scale_col_idx:
                    scale = row[scale_col_idx]
                    scales[scale] = scales.get(scale, 0) + 1
            print(f"\n규모별 분포:")
            for scale, count in sorted(scales.items()):
                print(f"  {scale}: {count}개")
        
        print(f"\n\n✅ {encoding} 인코딩이 가장 적합합니다!")
        break
        
    except Exception as e:
        print(f"  ❌ 실패: {str(e)}")
        continue
