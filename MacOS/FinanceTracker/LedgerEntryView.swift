import SwiftUI

struct Cell: View {
    var body: some View {
        HStack {
            VStack {
                Text("Wallet A")
                Text("Account 1")
            }
            Spacer()
            Text("21.37 PLN")
                    .font(.title2)
                    .fontWeight(.bold)
        }
        .padding()
        .frame(width: 200, height: 75)
        .background(.ultraThinMaterial)
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

struct Row: View {
    var body: some View {
        HStack {
            Cell()
            Spacer()
            Cell()
        }
    }
}

#Preview(traits: .sizeThatFitsLayout) {
    Row()
}
